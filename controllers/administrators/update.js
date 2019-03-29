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
        idAdministrator: req.params && req.params.id || null
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
            Log.Error('Bad request invalid administrator information.');
            return reject(new Errors.BadRequest('Bad request invalid administrator information.'));
        }
        else if (!Utilities.Validator.isInt(context.idAdministrator)) {
            Log.Error('Bad request invalid id administrator.');
            return reject(new Errors.BadRequest('Bad request invalid id administrator.'));
        }
        else if (!_.isEmpty(context.email) && !validator.isEmail(context.email)) {
            Log.Error('Bad request invalid email.');
            return reject(new Errors.BadRequest('Bad request invalid email.'));
        }
        else if (context.rol && !Utilities.Validator.isInt(context.rol)) {
            Log.Error('Bad request invalid rol.');
            return reject(new Errors.BadRequest('Bad request invalid rol.'));
        }
        return resolve(context);
    });
}

function verify(context) 
{
    return P.resolve()
        .then(() => {
            return getAdministrator(context);
        })
        .then(() => {
            return getAdministratorByEmail(context);
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

function getAdministratorByEmail(context) 
{
    if (!context.email || context.email === _.find(context.administrator.attributes, ['field.name', 'email']).value) {
        return P.resolve(context);
    }

    return new P((resolve, reject) => {
        return Models.Administrators.getByEmail(context.email, {
            useMaster: true,
            force: true
        })
        .then(administrator => {
            if (administrator) {
                Log.Error(`Administrator with email ${context.email} already exists.`);
                throw new Errors.ConflictError(`Administrator with email ${context.email} already exists.`);
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
            return Models.Administrators.getById(context.administrator.id, {
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

            if (context.name) {
                context.attributes.push({
                    name  : 'name',
                    value : context.name
                });
            }
            if (context.lastname) {
                context.attributes.push({
                    name  : 'lastname',
                    value : context.lastname
                });
            }
            if (context.email) {
                context.attributes.push({
                    name  : 'email',
                    value : context.email
                });
            }
            if (context.phone) {
                context.attributes.push({
                    name  : 'phone',
                    value : context.phone
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
                active: !_.isNil(context.active) ? context.active : context.administrator.active
            };

            if (context.rol) {
                data.id_administrator_permission = Number(context.rol);
            }

            return Models.Administrators.updateWithAttributes(data, context.administrator.id, context.attributes);
        })
        .then(model => {
            Models.Administrators.cacheClean();
            context.administrator = model;
            return model;
        });
}

module.exports = handle;
