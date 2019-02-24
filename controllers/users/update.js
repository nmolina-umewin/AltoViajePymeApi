"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const validator = require('validator');
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
                return getCompany(context);
            })
            /*
            .then(() => {
                return update(context);
            })
            */
            .then(model => {
                res.send(context.user);
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
        else if (_.isEmpty(context.idUser) || !validator.isInt(context.idUser)) {
            Log.Error('Bad request id user not found.');
            return reject(new Utilities.Errors.CustomError('Bad request id user not found.', {code: 400}));
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

function getUser(context) 
{
    return Models.Users.getById(context.idUser).then(user => {
        if (!user) {
            Log.Error(`User ${context.idUser} not found.`);
            return reject(Utilities.Errors.NotExists.User);
        }
        context.user = user;
        return context;
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

function update(context) 
{
    return Models.Users.update(context).then(user => {
        if (!user) {
            Log.Error('User can not updated.');
            return reject(new Utilities.Errors.CustomError('User can not updated.', {code: 500}));
        }
        return user;
    });
}

module.exports = handle;
