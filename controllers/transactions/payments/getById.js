"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../models');
const Utilities = require('../../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = {
        idPaymentTransaction : req.params && req.params.id,
        withoutCompany         : req.query && req.query.c ? false : true
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getPayment(context);
            })
            .then(model => {
                res.send(model);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (!Utilities.Validator.isInt(context.idPaymentTransaction)) {
            Log.Error('Bad request invalid id payment transaction.');
            return reject(new Errors.BadRequest('Bad request invalid id payment transaction.'));
        }
        return resolve(context);
    });
}

function getPayment(context) 
{
    let options = {
        withoutCompany: context.withoutCompany,
        withoutDetails: true
    };

    return Models.PaymentTransactions.getById(Number(context.idPaymentTransaction), options).then(transaction => {
        if (!transaction) {
            Log.Error(`Payment transaction ${context.idPaymentTransaction} not found.`);
            return P.reject(Errors.NotExists.PaymentTransaction);
        }
        return transaction;
    });
}

module.exports = handle;
