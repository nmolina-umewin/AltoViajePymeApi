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
        idPerson: req.params && req.params.id
    };

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getPerson(context);
            })
            .then(model => {
                res.send(model);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context.idPerson) || !validator.isInt(context.idPerson)) {
            Log.Error('Bad request invalid id person.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid id person.'));
        }
        return resolve(context);
    });
}

function getPerson(context) 
{
    return Models.Persons.getById(context.idPerson).then(person => {
        if (!person) {
            Log.Error(`Person ${context.idPerson} not found.`);
            return P.reject(Utilities.Errors.NotExists.Person);
        }
        return person;
    });
}

module.exports = handle;