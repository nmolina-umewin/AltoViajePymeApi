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
        idRechargePaymentOrder: req.params && req.params.id || null,
        idRechargePaymentOrderStatus: body.idRechargePaymentOrderStatus || body.id_recharge_payment_order_status || null,
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
            Log.Error('Bad request invalid recharge payment order information.');
            return reject(new Errors.BadRequest('Bad request invalid recharge payment order information.'));
        }
        else if (!Utilities.Validator.isInt(context.idRechargePaymentOrder)) {
            Log.Error('Bad request invalid id recharge payment order.');
            return reject(new Errors.BadRequest('Bad request invalid id recharge payment order.'));
        }
        else if (!Utilities.Validator.isInt(context.idRechargePaymentOrderStatus)) {
            Log.Error('Bad request invalid id recharge payment order status.');
            return reject(new Errors.BadRequest('Bad request invalid id recharge payment order status.'));
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
            return getPaymentOrder(context);
        })
        .then(() => {
            return getRechargePaymentOrderStatus(context);
        })
        .then(() => {
            return getAdministrator(context);
        });
}

function getPaymentOrder(context) 
{
    return Models.RechargePaymentOrders.getById(context.idRechargePaymentOrder).then(order => {
        if (!order) {
            Log.Error(`Recharge payment order ${context.idRechargePaymentOrder} not found.`);
            return P.reject(Errors.NotExists.RechargePaymentOrder);
        }
        context.order = order;
        return context;
    });
}

function getRechargePaymentOrderStatus(context) 
{
    return P.resolve()
        .then(() => {
            if (context.order.status.id === Number(context.idRechargePaymentOrderStatus)) {
                Log.Error('Recharge payment order status is equal to current status.');
                return P.reject(new Errors.ConflictError('Recharge payment order status is equal to current status.'));
            }
            return P.resolve();
        })
        .then(() => {
            return Models.RechargePaymentOrderStatuses.getById(context.idRechargePaymentOrderStatus).then(status => {
                if (!status) {
                    Log.Error(`Recharge payment order status ${context.idRechargePaymentOrderStatus} not found.`);
                    return P.reject(Errors.NotExists.RechargePaymentOrderStatus);
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
            return Models.RechargePaymentOrders.getById(context.order.id, {
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
            context.details = JSON.parse(context.order.description);

            context.details.changes = context.details.changes || [];
            context.details.changes.push({
                id_recharge_payment_order_status_from : context.order.status.id,
                id_recharge_payment_order_status_to   : context.status.id,
                id_administrator                      : context.administrator.id,
                updated_at                            : new Date()
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
                id_recharge_payment_order_status : context.status.id,
                description                      : context.details
            };

            return Models.RechargePaymentOrders.update(data, context.order.id);
        })
        .then(model => {
            Models.RechargePaymentOrders.cacheClean();
            return model;
        });
}

module.exports = handle;
