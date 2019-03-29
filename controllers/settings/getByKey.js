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
        key: req.query && req.query.k || ''
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getSettings(context);
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
            return reject(new Errors.BadRequest('Bad request invalid key.'));
        }
        else if (_.isEmpty(context.key)) {
            Log.Error('Bad request invalid key.');
            return reject(new Errors.BadRequest('Bad request invalid key.'));
        }
        return resolve(context);
    });
}

function getSettings(context) 
{
    return Models.Settings.getByKey(`%${context.key}%`).then(settings => {
        if (!settings) {
            Log.Error(`Settings for key ${context.key} not found.`);
            return P.reject(Errors.NotExists.Settings);
        }
        return settings;
    });
}

module.exports = handle;
