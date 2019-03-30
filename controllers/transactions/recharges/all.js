"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../models');
const Utilities = require('../../../utilities');

function handle(req, res) 
{
    let context = _.extend({}, Utilities.Functions.Pagination(req.query), {
        withoutCompany : req.query && req.query.c ? false : true
    });

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return getRecharges(context);
            })
            .then(models => {
                res.send(models);
            })
    );
}

function getRecharges(context) 
{
    let options = {
        withoutCompany: context.withoutCompany,
        withoutDetails: true
    };

    if (context.limit) {
        options.limit = context.limit;
        options.offset = context.offset;
    }

    return Models.RechargeTransactions.getAll(options).then(transactions => {
        return transactions || [];
    });
}

module.exports = handle;
