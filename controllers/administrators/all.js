"use strict";

const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');

function handle(req, res) 
{
    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return getAdministrators();
            })
            .then(models => {
                res.send(models);
            })
    );
}

function getAdministrators() 
{
    return Models.Administrators.getAll().then(models => {
        return models || [];
    });
}

module.exports = handle;
