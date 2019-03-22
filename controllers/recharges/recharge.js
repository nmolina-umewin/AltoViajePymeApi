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

function handle(req, res) 
{
    let context = _.extend({}, req.body);

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validateRecharges(context);
            })
            .then(() => {
                return populateRecharges(context);
            })
            .then(() => {
                return recharge(context);
            })
            .then(model => {
                res.send(model);
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
