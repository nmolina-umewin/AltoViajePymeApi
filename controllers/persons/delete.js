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
        idPerson: req.params && req.params.id || null
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getPerson(context);
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
            Log.Error('Bad request invalid person.');
            return reject(new Errors.BadRequest('Bad request invalid person.'));
        }
        else if (_.isEmpty(context.idPerson) || !validator.isInt(context.idPerson)) {
            Log.Error('Bad request invalid id person.');
            return reject(new Errors.BadRequest('Bad request invalid id person.'));
        }
        return resolve(context);
    });
}

function getPerson(context) 
{
    return Models.Persons.getById(context.idPerson).then(person => {
        if (!person) {
            Log.Error(`Person ${context.idPerson} not found.`);
            return P.reject(Errors.NotExists.Person);
        }
        context.person = person;
        return context;
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

            return Models.Persons.update(data, context.person.id);
        })
        .then(() => {
            Models.Companies.cacheClean();
            Models.Persons.cacheClean(context.person.id);
            return context;
        });
}

module.exports = handle;
