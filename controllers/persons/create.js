"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const validator = require('validator');
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = _.extend({}, req.body);

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getCompany(context);
            })
            .then(() => {
                return create(context);
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
            return reject(new Utilities.Errors.BadRequest('Bad request invalid person information.'));
        }
        else if (!context.idCompany) {
            Log.Error('Bad request invalid id company.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid id company.'));
        }
        else if (_.isEmpty(context.name)) {
            Log.Error('Bad request invalid name.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid name.'));
        }
        else if (_.isEmpty(context.cuil)) {
            Log.Error('Bad request invalid cuil.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid cuil.'));
        }
        else if (_.isEmpty(context.email) || !validator.isEmail(context.email)) {
            Log.Error('Bad request invalid email.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid email.'));
        }
        else if (_.isEmpty(context.groups) || !_.every(context.groups, validator.isInt)) {
            Log.Error('Bad request invalid groups.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid groups.'));
        }
        else if (_.isEmpty(context.cards) && _.isEmpty(context.card)) {
            Log.Error('Bad request invalid cards or card.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid cards or card.'));
        }
        return resolve(context);
    });
}

function getCompany(context) 
{
    return Models.Companies.getById(context.idCompany).then(company => {
        if (!company) {
            Log.Error(`Company ${context.idCompany} not found.`);
            return P.reject(Utilities.Errors.NotExists.Company);
        }
        context.company = company;
        return context;
    });
}

function create(context) 
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

            context.attributes.push({
                name  : 'name',
                value : context.name
            });
            context.attributes.push({
                name  : 'cuil',
                value : context.cuil
            });
            context.attributes.push({
                name  : 'email',
                value : context.email
            });
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
                id_company : context.idCompany,
                active     : 1
            };

            return Models.Persons.createWithAttributes(data, context.attributes, {
                groups : context.groups,
                cards  : context.cards
            });
        })
        .then(model => {
            Models.Companies.cacheClean(context.idCompany);
            context.person = model;
            return model;
        });
}

module.exports = handle;
