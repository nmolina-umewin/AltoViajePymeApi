"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const validator = require('validator');
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = {
        idUser: req.params && req.params.id
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
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
        if (_.isEmpty(context.idUser) || !validator.isInt(context.idUser)) {
            Log.Error('Bad request invalid id user.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid id user.'));
        }
        return resolve(context);
    });
}

function getUser(context) 
{
    return Models.Users.getById(context.idUser).then(user => {
        if (!user) {
            Log.Error(`User ${context.idUser} not found.`);
            return P.reject(Utilities.Errors.NotExists.User);
        }
        return user;
    });
}

module.exports = handle;
