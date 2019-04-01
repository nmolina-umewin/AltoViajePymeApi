"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../models');
const Utilities = require('../../../utilities');
const validator = require('validator');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let body = req.body || {};
    let context = _.extend({}, req.context || {}, {
        idPaymentTransaction       : req.params && req.params.id || null,
        idPaymentTransactionStatus : body.idPaymentTransactionStatus || body.id_payment_transaction_status || null,
        idAdministrator            : body.idAdministrator || body.id_administrator || null
    });

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return verify(context);
            })
            .then(() => {
                return update(context);
            })
            .then(model => {
                res.send(model);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context)) {
            Log.Error('Bad request invalid payment transaction information.');
            return reject(new Errors.BadRequest('Bad request invalid payment transaction information.'));
        }
        else if (!Utilities.Validator.isInt(context.idPaymentTransaction)) {
            Log.Error('Bad request invalid id payment transaction.');
            return reject(new Errors.BadRequest('Bad request invalid id payment transaction.'));
        }
        else if (!Utilities.Validator.isInt(context.idPaymentTransactionStatus)) {
            Log.Error('Bad request invalid id payment transaction status.');
            return reject(new Errors.BadRequest('Bad request invalid id payment transaction status.'));
        }
        else if (!Utilities.Validator.isInt(context.idAdministrator)) {
            Log.Error('Bad request invalid id administrator.');
            return reject(new Errors.BadRequest('Bad request invalid id administrator.'));
        }
        return resolve(context);
    });
}

function verify(context) 
{
    return P.resolve()
        .then(() => {
            return getTransaction(context);
        })
        .then(() => {
            return getPaymentTransactionStatus(context);
        })
        .then(() => {
            return getAdministrator(context);
        });
}

function getTransaction(context) 
{
    return Models.PaymentTransactions.getById(context.idPaymentTransaction).then(transaction => {
        if (!transaction) {
            Log.Error(`Payment transaction ${context.idPaymentTransaction} not found.`);
            return P.reject(Errors.NotExists.PaymentTransaction);
        }
        context.transaction = transaction;
        return context;
    });
}

function getPaymentTransactionStatus(context) 
{
    return P.resolve()
        .then(() => {
            if (context.transaction.status.id === Number(context.idPaymentTransactionStatus)) {
                Log.Error('Payment transaction status is equal to current status.');
                return P.reject(new Errors.ConflictError('Payment transaction status is equal to current status.'));
            }
            return P.resolve();
        })
        .then(() => {
            return Models.PaymentTransactionStatuses.getById(context.idPaymentTransactionStatus).then(status => {
                if (!status) {
                    Log.Error(`Payment transaction status ${context.idPaymentTransactionStatus} not found.`);
                    return P.reject(Errors.NotExists.PaymentTransactionStatus);
                }
                context.status = status;
                return context;
            });
        });
}

function getAdministrator(context) 
{
    return Models.Administrators.getById(context.idAdministrator).then(administrator => {
        if (!administrator) {
            Log.Error(`Administrator ${context.idAdministrator} not found.`);
            return P.reject(Errors.NotExists.Administrator);
        }
        context.administrator = administrator;
        return context;
    });
}

function update(context) 
{
    return P.resolve()
        .then(() => {
            return prepare(context);
        })
        .then(() => {
            return save(context);
        })
        .then(() => {
            return Models.PaymentTransactions.getById(context.transaction.id, {
                withoutDetails: true,
                useMaster: true,
                force: true
            });
        });
}

function prepare(context) 
{
    return P.resolve()
        .then(() => {
            context.details = JSON.parse(context.transaction.description);

            context.details.changes = context.details.changes || [];
            context.details.changes.push({
                id_payment_transaction_status_from : context.transaction.status.id,
                id_payment_transaction_status_to   : context.status.id,
                id_administrator                     : context.administrator.id,
                updated_at                           : new Date()
            });
            context.details = JSON.stringify(context.details);
            return context;
        });
}

function save(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                id_payment_transaction_status : context.status.id,
                description                     : context.details
            };

            return Models.PaymentTransactions.update(data, context.transaction.id);
        })
        .then(model => {
            Models.Companies.cacheClean(context.transaction.company.id);
            Models.PaymentTransactions.cacheClean();
            return model;
        });
}

module.exports = handle;
