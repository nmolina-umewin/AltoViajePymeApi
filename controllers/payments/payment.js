"use strict";

const _               = require('lodash');
const P               = require('bluebird');
const Models          = require('../../models');
const Utilities       = require('../../utilities');
const validatePayment = require('./functions/validate');
const populatePayment = require('./functions/populate');
const Log             = Utilities.Log;

const EVENT_CONTEXT_PROPERTIES     = ['idOperator', 'idCompany', 'idUser', 'payload'];
const EVENT_TRANSACTION_PROCESSING = 30041;
const EVENT_TRANSACTION_SUCCESS    = 30042;
const EVENT_TRANSACTION_ERROR      = 30043;

function handle(req, res) 
{
    let body = req.body || {};
    let context = _.extend({}, req.context || {}, {
        idCompany: body.idCompany || body.id_company || null,
        idUser: body.idUser || body.id_user || null,
        idOperator: body.idOperator || body.id_operator || null,
        payload: body.payload || {}
    });

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validatePayment(context);
            })
            .then(() => {
                return populatePayment(context);
            })
            .then(() => {
                // Emit event buy points in progress
                return context.eventer.emit(EVENT_TRANSACTION_PROCESSING, _.pick(context, EVENT_CONTEXT_PROPERTIES))
                    .catch(Log.Error)
                    .then(() => {
                        // Process payment
                        return buy(context);
                    });
            })
            .then(model => {
                // Emit event buy points success
                return context.eventer.emit(EVENT_TRANSACTION_SUCCESS, _.extend(_.pick(context, EVENT_CONTEXT_PROPERTIES), {
                    id_payment_transaction: model.id,
                    id_payment_transaction_status: model.status.id,
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
                // Emit event buy points error
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

function buy(context) 
{
    return P.resolve()
        .then(() => {
            return save(context);
        })
        .then(() => {
            return Models.PaymentTransactions.getById(context.transaction.id, {
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
            return context.processor(context).then(transaction => {
                Models.Companies.cacheClean(context.idCompany);
                Models.PaymentTransactions.cacheClean();

                context.transaction = transaction;
                return context;
            });
        });
}

module.exports = handle;
