"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const md5       = require('md5');
const Models    = require('../../models');
const Utilities = require('../../utilities');
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
                return getPermission(context);
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
            Log.Error('Bad request invalid administrator information.');
            return reject(new Errors.BadRequest('Bad request invalid administrator information.'));
        }
        else if (_.isEmpty(context.name)) {
            Log.Error('Bad request invalid name.');
            return reject(new Errors.BadRequest('Bad request invalid name.'));
        }
        else if (_.isEmpty(context.lastname)) {
            Log.Error('Bad request invalid lastname.');
            return reject(new Errors.BadRequest('Bad request invalid lastname.'));
        }
        else if (_.isEmpty(context.password) || !validator.isLength(context.password, { min: 6 })) {
            Log.Error('Bad request invalid password.');
            return reject(new Errors.BadRequest('Bad request invalid password.'));
        }
        else if (_.isEmpty(context.email) || !validator.isEmail(context.email)) {
            Log.Error('Bad request invalid email.');
            return reject(new Errors.BadRequest('Bad request invalid email.'));
        }
        else if (!Utilities.Validator.isInt(context.rol)) {
            Log.Error('Bad request invalid rol.');
            return reject(new Errors.BadRequest('Bad request invalid rol.'));
        }
        return resolve(context);
    });
}

function getPermission(context)
{
    return Models.AdministratorPermissions.getById(Number(context.rol)).then(permission => {
        if (!permission) {
            Log.Error(`Administrator permission ${context.rol} not found.`);
            return P.reject(Errors.NotExists.AdministratorPermission);
        }
        context.permission = permission;
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
            return Models.Administrators.getById(context.administrator.id, {
                withCode: true,
                useMaster: true,
                force: true
            })
            .then(model => {
                model.token = context.administrator.token;
                return model;
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
                value : context.name
            });
            context.attributes.push({
                name  : 'lastname',
                value : context.lastname
            });
            context.attributes.push({
                name  : 'email',
                value : context.email
            });
            context.attributes.push({
                name  : 'password',
                value : md5(context.password)
            });
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
                id_administrator_permission : Number(context.rol),
                code                        : uuidv4(),
                active                      : 1
            };

            return Models.Administrators.createWithAttributes(data, context.attributes);
        })
        .then(model => {
            Models.Administrators.cacheClean();
            context.administrator = model;
            return model;
        });
}

module.exports = handle;
