"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const validator = require('validator');
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = {
        ids: req.body && req.body.ids || null
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return update(context);
            })
            .then(() => {
                res.status(Utilities.Http.Status.NO_CONTENT).send();
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context)) {
            Log.Error('Bad request person not found.');
            return reject(new Utilities.Errors.BadRequest('Bad request person not found.'));
        }
        else if (_.isEmpty(context.ids) || !_.every(context.ids, validator.isInt)) {
            Log.Error('Bad request ids person not found.');
            return reject(new Utilities.Errors.BadRequest('Bad request ids person not found.'));
        }
        return resolve(context);
    });
}

function update(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                active: 0,
                deleted_at: new Date()
            };

            return Models.Persons.update(data, {
                $in: context.ids
            });
        })
        .then(() => {
            Models.Companies.cacheClean();
            Models.Persons.cacheClean();
            return P.resolve();
        });
}

module.exports = handle;
