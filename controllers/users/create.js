"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const validator = require('validator');
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
            /*
            REMOVE THIS THEN :: BEGIN
            */
            .then(() => {
                return Models.Users.getById(1);
            })
            /*
            REMOVE THIS THEN :: END
            */
            /*
            .then(() => {
                return create(context);
            })
            */
            .then(model => {
                res.send(model);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context)) {
            Log.Error('Bad request user information not found.');
            return reject(new Utilities.Errors.CustomError('Bad request user information not found.', {code: 400}));
        }
        else if (!context.idCompany) {
            Log.Error('Bad request id company not found.');
            return reject(new Utilities.Errors.CustomError('Bad request id company not found.', {code: 400}));
        }
        else if (_.isEmpty(context.name)) {
            Log.Error('Bad request name not found.');
            return reject(new Utilities.Errors.CustomError('Bad request name not found.', {code: 400}));
        }
        else if (_.isEmpty(context.email) || !validator.isEmail(context.email)) {
            Log.Error('Bad request email not found.');
            return reject(new Utilities.Errors.CustomError('Bad request email not found.', {code: 400}));
        }
        else if (_.isEmpty(context.rol) || !validator.isInt(context.rol)) {
            Log.Error('Bad request rol not found.');
            return reject(new Utilities.Errors.CustomError('Bad request rol not found.', {code: 400}));
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

function create(context) 
{
    return Models.Users.create(context).then(user => {
        if (!user) {
            Log.Error('User can not created.');
            return reject(new Utilities.Errors.CustomError('User can not created.', {code: 500}));
        }
        return user;
    });
}

module.exports = handle;
