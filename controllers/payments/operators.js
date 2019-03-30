"use strict";

const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return getOperators();
            })
            .then(models => {
                res.send(models);
            })
    );
}

function getOperators() 
{
    let options = {
        order: [['priority', 'ASC']]
    };

    return Models.Operators.getAll(options).then(models => {
        if (!models) {
            Log.Error('Operators not found.');
            return P.reject(Errors.NotExists.Operators);
        }
        return models;
    });
}

module.exports = handle;
