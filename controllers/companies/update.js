"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const validator = require('validator');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = _.extend({}, req.body, {
        idCompany: req.params && req.params.id || null
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
        else if (!_.isEmpty(context.email) && !validator.isEmail(context.email)) {
            Log.Error('Bad request invalid email.');
            return reject(new Errors.BadRequest('Bad request invalid email.'));
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
            return getCompanyByEmail(context);
        });
}

function getCompany(context) 
{
    return Models.Companies.getById(context.idCompany).then(company => {
        if (!company) {
            Log.Error(`Company ${context.idCompany} not found.`);
            return reject(Errors.NotExists.Company);
        }
        context.company = company;
        return context;
    });
}

function getCompanyByEmail(context)
{
    if (!context.email || context.email === _.find(context.company.attributes, ['field.name', 'email']).value) {
        return P.resolve(context);
    }

    return new P((resolve, reject) => {
        return Models.Companies.getByEmail(context.email, {
            useMaster: true,
            force: true
        })
        .then(company => {
            if (company) {
                Log.Error(`Company with email ${context.email} already exists.`);
                throw new Errors.ConflictError(`Company with email ${context.email} already exists.`);
            }
            return resolve();
        })
        .catch(reject);
    });
}

function update(context) 
{
    return P.resolve()
        .then(() => {
            return prepare(context);
        })
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

function prepare(context) 
{
    return P.resolve()
        .then(() => {
            context.attributes = [];

            if (context.email) {
                context.attributes.push({
                    name  : 'email',
                    value : context.email
                });
            }
            if (context.address) {
                context.attributes.push({
                    name  : 'address',
                    value : context.address
                });
            }
            if (context.phone) {
                context.attributes.push({
                    name  : 'phone',
                    value : context.phone
                });
            }
            if (context.alternative_phone) {
                context.attributes.push({
                    name  : 'alternative_phone',
                    value : context.alternative_phone
                });
            }
            if (context.image) {
                context.attributes.push({
                    name  : 'image',
                    value : context.image
                });
            }
            return context;
        });
}

function save(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                id_company_status : !_.isNil(context.status) ? context.status : context.company.status.id,
                active            : !_.isNil(context.active) ? context.active : context.company.active,
            };
            let options = {};

            return Models.Companies.updateWithAttributes(data, context.company.id, context.attributes, options);
        })
        .then(model => {
            Models.Companies.cacheClean(context.idCompany);
            Models.Users.cacheClean();
            context.company = model;
            return model;
        });
}

module.exports = handle;
