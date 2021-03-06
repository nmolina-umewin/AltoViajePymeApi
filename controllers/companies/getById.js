"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const Errors    = Utilities.Errors;
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
            .then(company => {
                res.send(company);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (!Utilities.Validator.isInt(context.idCompany)) {
            Log.Error('Bad request id company not found.');
            return reject(new Errors.BadRequest('Bad request id company not found.'));
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
        return company;
    });
}

module.exports = handle;
