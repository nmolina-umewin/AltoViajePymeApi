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
                return getUsers(context);
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
            Log.Error('Bad request id company not found.');
            return reject(new Utilities.Errors.CustomError('Bad request id company not found.', {code: 400}));
        }
        return resolve(context);
    });
}

function getCompany(context) 
{
    return Models.Companies.getById(context.idCompany).then(company => {
        if (!company) {
            Log.Error(`Company ${context.idCompany} not found.`);
            return reject(Utilities.Errors.NotExists.Company);
        }
        context.company = company;
        return context;
    });
}

function getUsers(context) 
{
    let options = {
        withoutCompany: true
    };

    return Models.Users.getByCompany(context.idCompany, options).then(users => {
        return users || [];
    });
}

module.exports = handle;
