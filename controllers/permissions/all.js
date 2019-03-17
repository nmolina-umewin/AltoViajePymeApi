"use strict";

const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
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
    return Models.Permissions.getAll().then(permissions => {
        if (!permissions) {
            Log.Error('Permissions not found.');
            return P.reject(Utilities.Errors.NotExists.Permissions);
        }
        return permissions;
    });
}

module.exports = handle;
