"use strict";

const _         = require('lodash');
const P         = require('bluebird');
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
            Log.Error('Bad request invalid user information.');
            return reject(new Errors.BadRequest('Bad request invalid user information.'));
        }
        else if (!Utilities.Validator.isInt(context.idCompany)) {
            Log.Error('Bad request invalid id company.');
            return reject(new Errors.BadRequest('Bad request invalid id company.'));
        }
        else if (_.isEmpty(context.name)) {
            Log.Error('Bad request invalid name.');
            return reject(new Errors.BadRequest('Bad request invalid name.'));
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
            return Models.Users.getById(context.user.id, {
                withCode: true,
                useMaster: true,
                force: true
            })
            .then(model => {
                model.token = context.user.token;
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
                name  : 'email',
                value : context.email
            });
            return context;
        });
}

function save(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                id_user_status : Models.UserStatuses.PENDING,
                code           : uuidv4(),
                active         : 0
            };

            return Models.Users.createWithAttributes(data, context.attributes, {
                idCompany    : Number(context.idCompany),
                idPermission : Number(context.rol)
            });
        })
        .then(model => {
            Models.Companies.cacheClean(context.idCompany);
            context.user = model;
            return model;
        });
}

module.exports = handle;
