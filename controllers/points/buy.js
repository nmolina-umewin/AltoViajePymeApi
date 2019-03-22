"use strict";

const _                 = require('lodash');
const P                 = require('bluebird');
const Models            = require('../../models');
const Utilities         = require('../../utilities');
const validateOperation = require('./functions/validate');
const populateOperation = require('./functions/populate');

function handle(req, res) 
{
    let context = _.extend({}, req.body);

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validateOperation(context);
            })
            .then(() => {
                return populateOperation(context);
            })
            .then(() => {
                return buy(context);
            })
            .then(model => {
                res.send(model);
            })
    );
}

function buy(context) 
{
    return P.resolve()
        .then(() => {
            return save(context);
        })
        .then(() => {
            return Models.OperationTransactions.getById(context.operation.id, {
                withoutDetails: false,
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
            return context.processor(context).then(transaction => {
                context.transaction = transaction;
                return context;
            });
        })
        .then(model => {
            Models.Companies.cacheClean(context.idCompany);
            Models.OperationTransactions.cacheClean();
            context.operation = model;
            return model;
        });
}

module.exports = handle;
