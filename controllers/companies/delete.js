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
        idCompany: req.params && req.params.id || null
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
                return update(context);
            })
            .then(() => {
                res.status(Utilities.Http.Status.NO_CONTENT).send();
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context)) {
            Log.Error('Bad request invalid company.');
            return reject(new Errors.BadRequest('Bad request invalid company.'));
        }
        else if (!Utilities.Validator.isInt(context.idCompany)) {
            Log.Error('Bad request invalid id company.');
            return reject(new Errors.BadRequest('Bad request invalid id company.'));
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

function update(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                active: 0,
                deleted_at: new Date()
            };

            return Models.Companies.update(data, context.company.id);
        })
        .then(() => {
            Models.Companies.cacheClean(context.company.id);
            Models.Users.cacheClean();
            return context;
        });
}

module.exports = handle;
