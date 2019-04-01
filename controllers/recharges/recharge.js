"use strict";

const _                 = require('lodash');
const P                 = require('bluebird');
const Models            = require('../../models');
const Utilities         = require('../../utilities');
const Recharges         = require('../../services/recharges');
const validateRecharges = require('./functions/validate');
const populateRecharges = require('./functions/populate');
const prepareRecharges  = require('./functions/prepare');
const processRecharges  = require('./functions/process');
const Errors            = Utilities.Errors;
const Log               = Utilities.Log;

const EVENT_CONTEXT_PROPERTIES     = ['idCompany', 'idUser', 'payload'];
const EVENT_TRANSACTION_PROCESSING = 30051;
const EVENT_TRANSACTION_SUCCESS    = 30052;
const EVENT_TRANSACTION_ERROR      = 30053;

function handle(req, res) 
{
    let body = req.body || {};
    let context = _.extend({}, req.context || {}, {
        idCompany: body.idCompany || body.id_company || null,
        idUser: body.idUser || body.id_user || null,
        payload: body.payload || {}
    });

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validateRecharges(context);
            })
            .then(() => {
                return populateRecharges(context);
            })
            .then(() => {
                // Emit event recharge sube in progress
                return context.eventer.emit(EVENT_TRANSACTION_PROCESSING, _.pick(context, EVENT_CONTEXT_PROPERTIES))
                    .catch(Log.Error)
                    .then(() => {
                        // Process recharge
                        return recharge(context);
                    });
            })
            .then(model => {
                // Emit event recharge sube success
                return context.eventer.emit(EVENT_TRANSACTION_SUCCESS, _.extend(_.pick(context, EVENT_CONTEXT_PROPERTIES), {
                    id_recharge_transaction: model.id,
                    id_recharge_transaction_status: model.status.id,
                    status: model.status.description,
                    description: model.description
                }))
                .catch(Log.Error)
                .then(() => {
                    // Send response to client
                    return res.send(model);
                });
            })
            .catch(error => {
                // Emit event recharge sube error
                return context.eventer.emit(EVENT_TRANSACTION_ERROR, _.extend(_.pick(context, EVENT_CONTEXT_PROPERTIES), {
                    error: `${error}`
                }))
                .catch(Log.Error)
                .then(() => {
                    // Handle error
                    throw error;
                });
            })
    );
}

function recharge(context) 
{
    return P.resolve()
        .then(() => {
            return prepareRecharges(context);
        })
        .then(() => {
            return save(context);
        })
        .then(() => {
            return verify(context);
        })
        .then(() => {
            return Models.RechargeTransactions.getById(context.transaction.id, {
                withoutDetails: true,
                withoutCompany: true,
                useMaster: true,
                force: true
            });
        });
}

function save(context) 
{
    return P.resolve()
        .then(() => {
            return Recharges.batchRecharge(context.payload).then(transactions => {
                context.transactions = transactions;
                return context;
            });
        })
        .then(() => {
            return processRecharges(context);
        })
        .then(transaction => {
            return Models.RechargeTransactions.create(transaction);
        })
        .then(model => {
            Models.Companies.cacheClean(context.idCompany);
            Models.RechargeTransactions.cacheClean();
            context.transaction = model;
            return model;
        });
}

function verify(context) 
{
    return new P((resolve, reject) => {
        switch (context.transaction.id_recharge_transaction_status) {
            case Models.RechargeTransactionStatuses.FAIL:
                Log.Error('Recharge transaction fail.');
                return reject(new Errors.ConflictError('Recharge transaction fail.', {
                    id: context.transaction.id,
                    status: 'transaction_fail'
                }));

            case Models.RechargeTransactionStatuses.INCOMPLETE:
                let details = JSON.parse(context.transaction.description);

                Log.Error('Recharge transaction incomplete.');
                return reject(new Errors.ConflictError('Recharge transaction incomplete.', {
                    id: context.transaction.id,
                    persons: JSON.stringify(details.results.done),
                    status: 'transaction_incomplete'
                }));
        }
        return resolve(context.transaction);
    });
}

module.exports = handle;
