"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../models');
const Utilities = require('../../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = {
        token: req.params && req.params.token
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getToken(context);
            })
            .then(() => {
                return verify(context);
            })
            .then(() => {
                return getAdministrator(context);
            })
            .then(model => {
                res.send(model);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context.token)) {
            Log.Error('Bad request invalid token.');
            return reject(new Errors.BadRequest('Bad request invalid token.'));
        }
        return resolve(context);
    });
}

function getToken(context) 
{
    return Models.AdministratorTokens.getByToken(context.token).then(token => {
        if (!token) {
            Log.Error(`Administrator token not found.`);
            return P.reject(Errors.NotExists.Token);
        }
        context.token = token;
        return context;
    });
}

function verify(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                active : 1
            };

            return Models.Administrators.update(data, context.token.id_administrator);
        })
        .then(() => {
            Models.Administrators.cacheClean();
            return context;
        });
}

function getAdministrator(context) 
{
    return Models.Administrators.getById(context.token.id_administrator).then(administrator => {
        if (!administrator) {
            Log.Error(`Administrator ${context.token.id_administrator} not found.`);
            return P.reject(Errors.NotExists.Administrator);
        }
        return administrator;
    });
}

module.exports = handle;
