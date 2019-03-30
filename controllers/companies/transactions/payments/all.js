"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../../models');
const Utilities = require('../../../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = _.extend({}, Utilities.Functions.Pagination(req.query), {
        idCompany: req.params && req.params.id
    });

    if (req.query && req.query.s) {
        context.idPaymentTransactionStatus = req.query.s;
    }

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return verify(context);
            })
            .then(() => {
                return getPayments(context);
            })
            .then(models => {
                res.send(models);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (!Utilities.Validator.isInt(context.idCompany)) {
            Log.Error('Bad request invalid id company.');
            return reject(new Errors.BadRequest('Bad request invalid id company.'));
        }
        else if (!_.isEmpty(context.idPaymentTransactionStatus) && !Utilities.Validator.isInt(context.idPaymentTransactionStatus)) {
            Log.Error('Bad request invalid id payment transaction status.');
            return reject(new Errors.BadRequest('Bad request invalid id payment transaction status.'));
        }
        return resolve(context);
    });
}

function verify(context)
{
    return P.bind(this)
        .then(() => {
            return getPaymentTransactionStatus(context);
        });
}

function getPaymentTransactionStatus(context)
{
    if (!context.idPaymentTransactionStatus) {
        return P.resolve(context);
    }
    return Models.PaymentTransactionStatuses.getById(context.idPaymentTransactionStatus).then(status => {
        if (!status) {
            Log.Error(`Payment transaction status ${context.idPaymentTransactionStatus} not found.`);
            return P.reject(Errors.NotExists.PaymentTransactionStatus);
        }
        context.status = status;
        return context;
    });
}

function getPayments(context) 
{
    let options = {
        withoutDetails: true,
        withoutCompany: true
    };

    if (context.limit) {
        options.limit = context.limit;
        options.offset = context.offset;
    }

    if (!context.status) {
        return Models.PaymentTransactions.getByCompany(Number(context.idCompany), options).then(transactions => {
            return transactions || [];
        });
    }

    return Models.PaymentTransactions.getByCompanyAndStatus(Number(context.idCompany), context.status.id, options).then(transactions => {
        return transactions || [];
    });
}

module.exports = handle;
