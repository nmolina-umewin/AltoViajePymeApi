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
        idUser: req.params && req.params.id || null
    });

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getUser(context);
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
            Log.Error('Bad request invalid user information.');
            return reject(new Errors.BadRequest('Bad request invalid user information.'));
        }
        else if (!Utilities.Validator.isInt(context.idUser)) {
            Log.Error('Bad request invalid id user.');
            return reject(new Errors.BadRequest('Bad request invalid id user.'));
        }
        else if (!_.isEmpty(context.email) && !validator.isEmail(context.email)) {
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

function getUser(context) 
{
    return Models.Users.getById(context.idUser).then(user => {
        if (!user) {
            Log.Error(`User ${context.idUser} not found.`);
            return reject(Errors.NotExists.User);
        }
        context.user = user;
        return context;
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
            return Models.Users.getById(context.user.id, {
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
            if (context.email) {
                context.attributes.push({
                    name  : 'email',
                    value : context.email
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
                active: !_.isNil(context.active) ? context.active : context.user.active
            };
            let options = {};

            if (context.rol) {
                options.idPermission = Number(context.rol);
            }

            return Models.Users.updateWithAttributes(data, context.user.id, context.attributes, options);
        })
        .then(model => {
            Models.Companies.cacheClean(context.idCompany);
            Models.Users.cacheClean(context.user.id);
            context.user = model;
            return model;
        });
}

module.exports = handle;
