"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const md5       = require('md5');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const validator = require('validator');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = {
        email: req.body && req.body.email,
        password: req.body && req.body.password && md5(req.body.password) || null
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return login(context);
            })
            .then(model => {
                res.send(model);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context.email) || !validator.isEmail(context.email)) {
            Log.Error('Bad request email not found.');
            return reject(new Errors.BadRequest('Bad request email not found.'));
        }
        else if (_.isEmpty(context.password)) {
            Log.Error('Bad request password not found.');
            return reject(new Errors.BadRequest('Bad request password not found.'));
        }
        return resolve(context);
    });
}

function login(context) 
{
    return Models.Administrators.login(context.email, context.password).then(administrator => {
        if (!administrator) {
            Log.Error('Administrator not found.');
            return P.reject(Errors.NotExists.Administrator);
        }
        return administrator;
    });
}

module.exports = handle;
