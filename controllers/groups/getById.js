"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const validator = require('validator');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = {
        idGroup: req.params && req.params.id
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getGroup(context);
            })
            .then(model => {
                res.send(model);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context.idGroup) || !validator.isInt(context.idGroup)) {
            Log.Error('Bad request invalid id group.');
            return reject(new Errors.BadRequest('Bad request invalid id group.'));
        }
        return resolve(context);
    });
}

function getGroup(context) 
{
    return Models.Groups.getById(context.idGroup).then(group => {
        if (!group) {
            Log.Error(`Group ${context.idGroup} not found.`);
            return P.reject(Errors.NotExists.Group);
        }
        return group;
    });
}

module.exports = handle;
