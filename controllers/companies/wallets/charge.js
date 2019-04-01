"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../models');
const Utilities = require('../../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let body = req.body || {};
    let context = _.extend({}, req.context || {}, {
        idCompany: req.params && req.params.id || null,
        idAdministrator: body.idAdministrator || body.id_administrator || null,
        points: body.points || null
    });

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return verify(context);
            })
            .then(() => {
                return update(context);
            })
            .then(model => {
                res.send(model);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context)) {
            Log.Error('Bad request invalid company information.');
            return reject(new Errors.BadRequest('Bad request invalid company information.'));
        }
        else if (!Utilities.Validator.isInt(context.idCompany)) {
            Log.Error('Bad request invalid id company.');
            return reject(new Errors.BadRequest('Bad request invalid id company.'));
        }
        else if (!Utilities.Validator.isInt(context.idAdministrator)) {
            Log.Error('Bad request invalid id administrator.');
            return reject(new Errors.BadRequest('Bad request invalid id administrator.'));
        }
        else if (!context.points || !_.isNumber(context.points)) {
            Log.Error('Bad request invalid points.');
            return reject(new Errors.BadRequest('Bad request invalid points.'));
        }
        return resolve(context);
    });
}

function verify(context) 
{
    return P.resolve()
        .then(() => {
            return getCompany(context);
        })
        .then(() => {
            return getAdministrator(context);
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

function getAdministrator(context) 
{
    return Models.Administrators.getById(context.idAdministrator).then(administrator => {
        if (!administrator) {
            Log.Error(`Administrator ${context.idAdministrator} not found.`);
            return P.reject(Errors.NotExists.Administrator);
        }
        context.administrator = administrator;
        return context;
    });
}

function update(context) 
{
    return P.resolve()
        .then(() => {
            return save(context);
        })
        .then(() => {
            return Models.Companies.getById(context.company.id, {
                useMaster: true,
                force: true
            });
        });
}

function save(context) 
{
    return P.resolve()
        .then(() => {
            let options = {
                idAdministrator: context.idAdministrator,
                idCompany: context.idCompany
            };

            return Models.CompanyWallets.charge(context.company.wallet.id, context.points, options);
        })
        .then(model => {
            Models.Companies.cacheClean();
            Models.Users.cacheClean();
            return model;
        });
}

module.exports = handle;
