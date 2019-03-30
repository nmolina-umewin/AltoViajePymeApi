"use strict";

const P          = require('bluebird');
const Models     = require('../../../models');
const Utilities  = require('../../../utilities');
const Processors = require('./operators');
const Log        = Utilities.Log;

function populateOperation(context) 
{
    return P.resolve()
        .then(() => {
            return getEventer(context);
        })
        .then(() => {
            return getCompany(context);
        })
        .then(() => {
            return getUser(context);
        })
        .then(() => {
            return getOperator(context);
        })
        .then(() => {
            return getProcessor(context);
        });
}

function getEventer(context) 
{
    context.eventer = new Utilities.Eventer();
    return context;
}

function getCompany(context) 
{
    return Models.Companies.getById(context.idCompany).then(company => {
        if (!company) {
            Log.Error(`Company ${context.idCompany} not found.`);
            return P.reject(Utilities.Errors.NotExists.Company);
        }
        context.company = company;
        return context;
    });
}

function getUser(context) 
{
    return Models.Users.getById(context.idUser).then(user => {
        if (!user) {
            Log.Error(`User ${context.idUser} not found.`);
            return P.reject(Utilities.Errors.NotExists.User);
        }
        context.user = user;
        return context;
    });
}

function getOperator(context) 
{
    return Models.Operators.getById(context.idOperator).then(operator => {
        if (!operator) {
            Log.Error(`Operator ${context.idOperator} not found.`);
            return P.reject(Utilities.Errors.NotExists.Operator);
        }
        context.operator = operator;
        return context;
    });
}

function getProcessor(context) 
{
    let processor = Processors[context.operator.id];

    if (!processor) {
        Log.Error(`Processor for operator ${context.idOperator} not found.`);
        return P.reject(Utilities.Errors.NotExists.Operator);
    }
    context.processor = processor;
    return context;
}

module.exports = populateOperation;
