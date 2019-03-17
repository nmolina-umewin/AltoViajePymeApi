"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = {
        key: req.query && req.query.k || ''
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getConfigurations(context);
            })
            .then(models => {
                res.send(models);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context)) {
            Log.Error('Bad request invalid key.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid key.'));
        }
        else if (_.isEmpty(context.key)) {
            Log.Error('Bad request invalid key.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid key.'));
        }
        return resolve(context);
    });
}

function getConfigurations(context) 
{
    return Models.Configurations.getByKey(`%${context.key}%`).then(configurations => {
        if (!configurations) {
            Log.Error(`Configurations for key ${context.key} not found.`);
            return P.reject(Utilities.Errors.NotExists.Configurations);
        }
        return configurations;
    });
}

module.exports = handle;
