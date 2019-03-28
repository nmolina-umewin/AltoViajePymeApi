"use strict";

const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');

function handle(req, res) 
{
    let context = {
        idCompany: req.params && req.params.id
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return getCompanies(context);
            })
            .then(models => {
                res.send(models);
            })
    );
}

function getCompanies(context) 
{
    return Models.Companies.getAll().then(models => {
        return models || [];
    });
}

module.exports = handle;
