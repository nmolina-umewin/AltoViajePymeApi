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
        idRechargePaymentOrder: req.params && req.params.id
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getOrder(context);
            })
            .then(model => {
                res.send(model);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (!Utilities.Validator.isInt(context.idRechargePaymentOrder)) {
            Log.Error('Bad request invalid id recharge payment order.');
            return reject(new Errors.BadRequest('Bad request invalid id recharge payment order.'));
        }
        return resolve(context);
    });
}

function getOrder(context) 
{
    let options = {
        withoutDetails: true
    };

    return Models.RechargePaymentOrders.getById(context.idRechargePaymentOrder, options).then(order => {
        if (!order) {
            Log.Error(`Recharge payment order ${context.idRechargePaymentOrder} not found.`);
            return P.reject(Errors.NotExists.RechargePaymentOrder);
        }
        return order;
    });
}

module.exports = handle;
