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
        idRechargeTransaction: req.params && req.params.id || null,
        idRechargeTransactionSituation: body.idRechargeTransactionSituation || body.id_recharge_transaction_situation || null,
        idAdministrator: body.idAdministrator || body.id_administrator || null
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
            Log.Error('Bad request invalid recharge transaction information.');
            return reject(new Errors.BadRequest('Bad request invalid recharge transaction information.'));
        }
        else if (!Utilities.Validator.isInt(context.idRechargeTransaction)) {
            Log.Error('Bad request invalid id recharge transaction.');
            return reject(new Errors.BadRequest('Bad request invalid id recharge transaction.'));
        }
        else if (!Utilities.Validator.isInt(context.idRechargeTransactionSituation)) {
            Log.Error('Bad request invalid id recharge transaction situation.');
            return reject(new Errors.BadRequest('Bad request invalid id recharge transaction situation.'));
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
            return getRechargeTransactionSituation(context);
        })
        .then(() => {
            return getAdministrator(context);
        });
}

function getTransaction(context) 
{
    return Models.RechargeTransactions.getById(context.idRechargeTransaction).then(transaction => {
        if (!transaction) {
            Log.Error(`Recharge transaction ${context.idRechargeTransaction} not found.`);
            return P.reject(Errors.NotExists.RechargeTransaction);
        }
        context.transaction = transaction;
        return context;
    });
}

function getRechargeTransactionSituation(context) 
{
    return P.resolve()
        .then(() => {
            if (context.transaction.situation.id === Number(context.idRechargeTransactionSituation)) {
                Log.Error('Recharge transaction situation is equal to current situation.');
                return P.reject(new Errors.ConflictError('Recharge transaction situation is equal to current situation.'));
            }
            return P.resolve();
        })
        .then(() => {
            return Models.RechargeTransactionSituations.getById(context.idRechargeTransactionSituation).then(situation => {
                if (!situation) {
                    Log.Error(`Recharge transaction situation ${context.idRechargeTransactionSituation} not found.`);
                    return P.reject(Errors.NotExists.RechargeTransactionSituation);
                }
                context.situation = situation;
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
            return Models.RechargeTransactions.getById(context.transaction.id, {
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
                id_recharge_transaction_situation_from : context.transaction.situation.id,
                id_recharge_transaction_situation_to   : context.situation.id,
                id_administrator                       : context.administrator.id,
                updated_at                             : new Date()
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
                id_recharge_transaction_situation : context.situation.id,
                description                       : context.details
            };

            return Models.RechargeTransactions.update(data, context.transaction.id);
        })
        .then(model => {
            Models.Companies.cacheClean(context.transaction.company.id);
            Models.RechargeTransactions.cacheClean();
            return model;
        });
}

module.exports = handle;
