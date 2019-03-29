"use strict";

const P         = require('bluebird');
const Models    = require('../../../models');
const Utilities = require('../../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return getPermissions();
            })
            .then(models => {
                res.send(models);
            })
    );
}

function getPermissions() 
{
    return Models.AdministratorPermissions.getAll().then(models => {
        if (!models) {
            Log.Error('Administrator permissions not found.');
            return P.reject(Errors.NotExists.AdministratorPermissions);
        }
        return models;
    });
}

module.exports = handle;
