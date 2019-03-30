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

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getRecharges(context);
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
        return resolve(context);
    });
}

function getRecharges(context) 
{
    let options = {
        withoutDetails: true,
        withoutCompany: true
    };

    if (context.limit) {
        options.limit = context.limit;
        options.offset = context.offset;
    }

    return Models.RechargeTransactions.getByCompany(Number(context.idCompany), options).then(transactions => {
        if (!transactions) {
            Log.Error(`Recharge Transactions for company ${context.idCompany} not found.`);
            return P.reject(Errors.NotExists.RechargeTransactions);
        }
        return transactions;
    });
}

module.exports = handle;
