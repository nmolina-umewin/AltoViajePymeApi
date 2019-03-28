"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../../models');
const Utilities = require('../../../../utilities');
const validator = require('validator');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = {
        idCompany: req.params && req.params.id,
        idGroup: req.params && req.params.idGroup
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
                return getGroup(context);
            })
            .then(() => {
                return getPersons(context);
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
            return reject(new Errors.BadRequest('Bad request invalid id company.'));
        }
        else if (_.isEmpty(context.idGroup) || !validator.isInt(context.idGroup)) {
            Log.Error('Bad request invalid id group.');
            return reject(new Errors.BadRequest('Bad request invalid id group.'));
        }
        return resolve(context);
    });
}

function getCompany(context) 
{
    return Models.Companies.getById(context.idCompany).then(company => {
        if (!company) {
            Log.Error(`Company ${context.idCompany} not found.`);
            return P.reject(Errors.NotExists.Company);
        }
        context.company = company;
        return context;
    });
}

function getGroup(context) 
{
    let options = {
        where: {
            id_company: context.idCompany
        }
    };

    return Models.Groups.getById(context.idGroup, options).then(group => {
        if (!group) {
            Log.Error(`Group ${context.idGroup} not found.`);
            return P.reject(Errors.NotExists.Group);
        }
        context.group = group;
        return context;
    });
}

function getPersons(context) 
{
    let options = {
        withoutCompany: true
    };

    return Models.Persons.getByCompanyAndGroup(context.idCompany, context.idGroup, options).then(models => {
        return models || [];
    });
}

module.exports = handle;
