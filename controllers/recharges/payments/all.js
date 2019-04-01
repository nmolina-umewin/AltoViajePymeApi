"use strict";

const P         = require('bluebird');
const Models    = require('../../../models');
const Utilities = require('../../../utilities');

function handle(req, res) 
{
    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return getOrders();
            })
            .then(model => {
                res.send(model);
            })
    );
}

function getOrders() 
{
    let options = {
        withoutDetails: true
    };

    return Models.RechargePaymentOrders.getAll(options).then(orders => {
        return orders || [];
    });
}

module.exports = handle;
