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
    let context = _.extend({}, req.body, {
        idPerson: req.params && req.params.id || null
    });

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
            .then(model => {
                res.send(model);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context)) {
            Log.Error('Bad request invalid person information.');
            return reject(new Errors.BadRequest('Bad request invalid person information.'));
        }
        else if (!Utilities.Validator.isInt(context.idCompany)) {
            Log.Error('Bad request invalid id company.');
            return reject(new Errors.BadRequest('Bad request invalid id company.'));
        }
        else if (!_.isEmpty(context.email) && !validator.isEmail(context.email)) {
            Log.Error('Bad request invalid email.');
            return reject(new Errors.BadRequest('Bad request invalid email.'));
        }
        else if (_.isEmpty(context.groups) || !_.every(context.groups, Utilities.Validator.isInt)) {
            Log.Error('Bad request invalid groups.');
            return reject(new Errors.BadRequest('Bad request invalid groups.'));
        }
        else if (_.isEmpty(context.cards) && _.isEmpty(context.card)) {
            Log.Error('Bad request invalid cards or card.');
            return reject(new Errors.BadRequest('Bad request invalid cards or card.'));
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
            return prepare(context);
        })
        .then(() => {
            return save(context);
        })
        .then(() => {
            return Models.Persons.getById(context.person.id, {
                useMaster: true,
                force: true
            });
        });
}

function prepare(context) 
{
    return P.resolve()
        .then(() => {
            return prepareAttributes(context);
        })
        .then(() => {
            return prepareGroups(context);
        })
        .then(() => {
            return prepareCards(context);
        });
}

function prepareAttributes(context) 
{
    return P.resolve()
        .then(() => {
            context.attributes = [];

            if (context.name) {
                context.attributes.push({
                    name  : 'name',
                    value : context.name
                });
            }
            if (context.cuil) {
                context.attributes.push({
                    name  : 'cuil',
                    value : context.cuil
                });
            }
            if (context.email) {
                context.attributes.push({
                    name  : 'email',
                    value : context.email
                });
            }
            return context;
        });
}

function prepareGroups(context) 
{
    return P.resolve()
        .then(() => {
            if (!context.groups) {
                context.groups = [];
            }

            context.groups = _.map(context.groups, id => {
                return {
                    id : Number(id)
                };
            });
            return context;
        });
}

function prepareCards(context) 
{
    return P.resolve()
        .then(() => {
            if (!context.cards) {
                context.cards = [];
            }
            if (context.card) {
                // TODO Review this code when add more card types
                context.cards.push({
                    type: Models.CardTypes.SUBE,
                    number: context.card
                });
            }

            context.cards = _.reduce(context.cards, (memo, card) => {
                let number = _.trim(card.number || '');

                if (!_.isEmpty(number)) {
                    memo.push({
                        type : card.type,
                        number
                    });
                }
                return memo;
            }, []);
            return context;
        });
}

function save(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                active: !_.isNil(context.active) ? context.active : context.person.active
            };

            return Models.Persons.updateWithAttributes(data, context.person.id, context.attributes, {
                groups : context.groups,
                cards  : context.cards
            });
        })
        .then(model => {
            Models.Companies.cacheClean(context.idCompany);
            Models.Persons.cacheClean(context.person.id);
            context.person = model;
            return model;
        });
}

module.exports = handle;
