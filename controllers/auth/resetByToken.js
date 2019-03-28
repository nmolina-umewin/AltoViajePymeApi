"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
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
                return getUser(context);
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
    return Models.UserTokens.getByToken(context.token).then(token => {
        if (!token) {
            Log.Error(`User token not found.`);
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
                active         : 1,
                id_user_status : Models.UserStatuses.NEED_PASSWORD
            };

            return Models.Users.update(data, context.token.id_user);
        })
        .then(() => {
            Models.Companies.cacheClean();
            Models.Users.cacheClean();
            return context;
        });
}

function getUser(context) 
{
    return Models.Users.getById(context.token.id_user).then(user => {
        if (!user) {
            Log.Error(`User ${context.token.id_user} not found.`);
            return P.reject(Errors.NotExists.User);
        }
        return user;
    });
}

module.exports = handle;
