"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const md5       = require('md5');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = _.clone(req.body);

    context.idUser = context.idUser || context.id_user;
    delete context.id_user;

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getUser(context);
            })
            .then(() => {
                return reset(context);
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
        if (!Utilities.Validator.isInt(context.idUser)) {
            Log.Error('Bad request invalid id user.');
            return reject(new Errors.BadRequest('Bad request invalid id user.'));
        }
        else if (_.isEmpty(context.password)) {
            Log.Error('Bad request invalid password.');
            return reject(new Errors.BadRequest('Bad request invalid password.'));
        }
        return resolve(context);
    });
}

function getUser(context) 
{
    return Models.Users.getById(context.idUser).then(user => {
        if (!user) {
            Log.Error(`User ${context.idUser} not found.`);
            return P.reject(Errors.NotExists.User);
        }
        context.user = user;
        return user;
    });
}

function reset(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                active         : 1,
                id_user_status : Models.UserStatuses.VERIFIED
            };
            let attributes = [{
                name  : 'password',
                value : md5(context.password)
            }];

            return Models.Users.updateWithAttributes(data, context.user.id, attributes);
        })
        .then(() => {
            Models.Companies.cacheClean();
            Models.Users.cacheClean();
            return context;
        });
}

module.exports = handle;
