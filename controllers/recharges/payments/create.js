"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const async     = require('async');
const Models    = require('../../../models');
const Utilities = require('../../../utilities');
const validator = require('validator');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let body = req.body || {};
    let context = _.extend({}, req.context || {}, {
        idAdministrator: body.idAdministrator || body.id_administrator || null,
        ids: body.ids || null
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
            Log.Error('Bad request invalid recharge payment order information.');
            return reject(new Errors.BadRequest('Bad request invalid recharge payment order information.'));
        }
        else if (_.isEmpty(context.ids) || !_.every(context.ids, Utilities.Validator.isInt)) {
            Log.Error('Bad request invalid ids recharge transaction.');
            return reject(new Errors.BadRequest('Bad request invalid ids recharge transaction.'));
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
            return getRechargeTransactions(context);
        })
        .then(() => {
            return getAdministrator(context);
        });
}

function getRechargeTransactions(context) 
{
    context.amount = 0;
    context.transactions = [];

    return new P((resolve, reject) => {
        let options = {
            withoutCompany: true,
            withoutDetails: true
        };

        async.each(context.ids, (id, next) => {
            Models.RechargeTransactions.getById(id, options).then(transaction => {
                if (!transaction) {
                    Log.Error(`Recharge transaction ${context.idRechargePaymentOrder} not found.`);
                    return next(Errors.NotExists.RechargeTransaction);
                }
                context.transactions.push(transaction);
                context.amount += transaction.points;
                return next();
            })
            .catch(next);
        }, error => {
            if (error) return reject(error);
            return resolve();
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
            return save(context);
        })
        .then(() => {
            return Models.RechargePaymentOrders.getById(context.order.id, {
                withoutDetails: true,
                useMaster: true,
                force: true
            });
        });
}

function save(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                id_recharge_payment_order_status : Models.RechargePaymentOrderStatuses.PENDING,
                amount                           : context.amount,
                description                      : JSON.stringify({
                    changes: [{
                        id_administrator : context.administrator.id,
                        created_at       : new Date()
                    }]
                })
            };

            return Models.RechargePaymentOrders.create(data, {
                ids: context.ids
            });
        })
        .then(model => {
            Models.RechargePaymentOrders.cacheClean();
            context.order = model;
            return model;
        });
}

module.exports = handle;
