"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const md5       = require('md5');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const validator = require('validator');
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
            .then(user => {
                res.send(user);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context.email) || !validator.isEmail(context.email)) {
            Log.Error('Bad request email not found.');
            return reject(new Utilities.Errors.CustomError('Bad request email not found.', {code: 400}));
        }
        else if (_.isEmpty(context.password)) {
            Log.Error('Bad request password not found.');
            return reject(new Utilities.Errors.CustomError('Bad request password not found.', {code: 400}));
        }
        return resolve(context);
    });
}

function login(context) 
{
    return Models.Users.login(context.email, context.password).then(user => {
        if (!user) {
            Log.Error('User not found.');
            return reject(Utilities.Errors.NotExists.User);
        }
        return user;
    });
}

module.exports = handle;
