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
const validator         = require('validator');

function handle(req, res) 
{
    let context = _.extend({}, req.body, {
        idRechargeTransaction: req.params && req.params.id
    });

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getRechargeTransaction(context);
            })
            .then(() => {
                return prepare(context);
            })
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

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context.idRechargeTransaction) || !validator.isInt(context.idRechargeTransaction)) {
            Log.Error('Bad request invalid id recharge transaction.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid id recharge transaction.'));
        }
        return resolve(context);
    });
}

function getRechargeTransaction(context) 
{
    context.idRechargeTransaction = Number(context.idRechargeTransaction);

    return Models.RechargeTransactions.getById(context.idRechargeTransaction).then(rechargeTransaction => {
        if (!rechargeTransaction) {
            Log.Error(`Recharge Transaction ${context.idRechargeTransaction} not found.`);
            return P.reject(Utilities.Errors.NotExists.RechargeTransaction);
        }
        context.rechargeTransaction = rechargeTransaction;
        return context;
    });
}

function prepare(context) 
{
    return P.resolve()
        .then(() => {
            let idCompany = context.rechargeTransaction.id_company || context.rechargeTransaction.company.id;
            let details;

            if (context.idCompany !== idCompany) {
                Log.Error(`Bad request invalid company.`);
                return P.reject(new Utilities.Errors.BadRequest('Bad request invalid company.'));
            }

            details = context.rechargeTransaction.details || JSON.parse(context.rechargeTransaction.description);
            context.payload = [];

            _.each(details.persons, person => {
                context.payload.push({
                    person: person.id_person,
                    amount: person.amount
                });
            });
            return context;
        });
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

module.exports = handle;
