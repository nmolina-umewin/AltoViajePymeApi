"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../models');
const Utilities = require('../../../utilities');
const validator = require('validator');
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = {
        idCompany: req.params && req.params.id
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getCompany(context);
            })
            .then(() => {
                return getGroups(context);
            })
            .then(models => {
                res.send(models);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context.idCompany) || !validator.isInt(context.idCompany)) {
            Log.Error('Bad request invalid id company.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid id company.'));
        }
        return resolve(context);
    });
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

function getGroups(context) 
{
    let options = {
        withoutCompany: true
    };

    return Models.Groups.getByCompany(context.idCompany, options).then(models => {
        return models || [];
    });
}

module.exports = handle;
