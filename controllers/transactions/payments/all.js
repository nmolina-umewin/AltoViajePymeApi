"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../models');
const Utilities = require('../../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = _.extend({}, Utilities.Functions.Pagination(req.query), {
        withoutCompany : req.query && req.query.c ? false : true
    });

    if (req.query && req.query.o) {
        context.idOperator = req.query.o;
    }

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return verify(context);
            })
            .then(() => {
                return getPayments(context);
            })
            .then(models => {
                res.send(models);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (!_.isEmpty(context) && !_.isEmpty(context.idOperator) && !Utilities.Validator.isInt(context.idOperator)) {
            Log.Error('Bad request invalid id operator.');
            return reject(new Errors.BadRequest('Bad request invalid id operator.'));
        }
        return resolve(context);
    });
}

function verify(context)
{
    return P.bind(this)
        .then(() => {
            return getOperator(context);
        });
}

function getOperator(context)
{
    if (!context.idOperator) {
        return P.resolve(context);
    }
    return Models.Operators.getById(context.idOperator).then(operator => {
        if (!operator) {
            Log.Error(`Operator ${context.idOperator} not found.`);
            return P.reject(Errors.NotExists.Operator);
        }
        context.operator = operator;
        return context;
    });
}

function getPayments(context) 
{
    let options = {
        withoutCompany: context.withoutCompany,
        withoutDetails: true
    };

    if (context.limit) {
        options.limit = context.limit;
        options.offset = context.offset;
    }

    if (!context.operator) {
        return Models.PaymentTransactions.getAll(options).then(transactions => {
            return transactions || [];
        });
    }

    options.where = {
        id_operator: context.operator.id
    };
    return Models.PaymentTransactions.getAll(options).then(transactions => {
        return transactions || [];
    });
}

module.exports = handle;
