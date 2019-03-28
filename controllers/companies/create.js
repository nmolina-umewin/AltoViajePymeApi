"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const Afip      = require('../../services/afip');
const validator = require('validator');
const uuidv4    = require('uuid/v4');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = _.extend({}, req.body);

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return verify(context);
            })
            .then(() => {
                return getCompany(context);
            })
            .then(() => {
                return create(context);
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
        else if (_.isEmpty(context.cuit) || !Utilities.Validator.isCuit(context.cuit)) {
            Log.Error('Bad request invalid cuit.');
            return reject(new Errors.BadRequest('Bad request invalid cuit.'));
        }
        else if (_.isEmpty(context.email) || !validator.isEmail(context.email)) {
            Log.Error('Bad request invalid email.');
            return reject(new Errors.BadRequest('Bad request invalid email.'));
        }
        return resolve(context);
    });
}

function verify(context) 
{
    return new P((resolve, reject) => {
        return Models.Companies.getByCuit(context.cuit, {
            useMaster: true,
            force: true
        })
        .then(company => {
            if (company) {
                Log.Error(`Company with cuit ${context.cuit} already exists.`);
                throw new Errors.ConflictError(`Company with cuit ${context.cuit} already exists.`);
            }
            return resolve();
        })
        .catch(reject);
    });
}

function getCompany(context) 
{
    return Afip.getCompany(context.cuit).then(company => {
        if (!company) {
            Log.Error(`Company ${context.cuit} not found.`);
            return P.reject(Errors.NotExists.Company);
        }
        context.company = company;
        return context;
    });
}

function create(context) 
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
                withCode: true,
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

            context.attributes.push({
                name  : 'name',
                value : context.company.name
            });
            context.attributes.push({
                name  : 'cuit',
                value : context.cuit
            });
            context.attributes.push({
                name  : 'email',
                value : context.email
            });
            context.attributes.push({
                name  : 'legal_address',
                value : context.company.legal_address
            });
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
                id_company_status : Models.CompanyStatuses.PENDING,
                code              : uuidv4(),
                active            : 0
            };

            return Models.Companies.createWithAttributes(data, context.attributes);
        })
        .then(model => {
            Models.Companies.cacheClean();
            context.company = model;
            return model;
        });
}

module.exports = handle;
