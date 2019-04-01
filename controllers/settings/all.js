"use strict";

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
                return getSettings(context);
            })
            .then(models => {
                res.send(models);
            })
    );
}

function getSettings(context) 
{
    if (!context.key) {
        return Models.Settings.getAll().then(settings => {
            return settings || [];
        });
    }

    return Models.Settings.getByKey(`%${context.key}%`).then(settings => {
        if (!settings) {
            Log.Error(`Settings for key ${context.key} not found.`);
            return P.reject(Errors.NotExists.Settings);
        }
        return settings;
    });
}

module.exports = handle;
