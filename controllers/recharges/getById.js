"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = {
        idRechargeTransaction: req.params && req.params.id
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getRecharge(context);
            })
            .then(model => {
                res.send(model);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (!Utilities.Validator.isInt(context.idRechargeTransaction)) {
            Log.Error('Bad request invalid id recharge transaction.');
            return reject(new Errors.BadRequest('Bad request invalid id recharge transaction.'));
        }
        return resolve(context);
    });
}

function getRecharge(context) 
{
    let options = {
        withoutDetails: true,
        withoutCompany: true
    };

    return Models.RechargeTransactions.getById(Number(context.idRechargeTransaction), options).then(transaction => {
        if (!transaction) {
            Log.Error(`User ${context.idRechargeTransaction} not found.`);
            return P.reject(Errors.NotExists.RechargeTransaction);
        }
        return transaction;
    });
}

module.exports = handle;
