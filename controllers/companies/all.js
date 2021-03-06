"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');

function handle(req, res) 
{
    let context = _.extend({}, Utilities.Functions.Pagination(req.query), {
        idCompany: req.params && req.params.id
    });

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
    let options = {};

    if (context.limit) {
        options.limit = context.limit;
        options.offset = context.offset;
    }

    return Models.Companies.getAll().then(models => {
        return models || [];
    });
}

module.exports = handle;
