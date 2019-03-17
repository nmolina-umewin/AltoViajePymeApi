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
        else if (!_.isEmpty(context.persons) && !_.every(context.persons, validator.isInt)) {
            Log.Error('Bad request invalid persons.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid persons.'));
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
            return Models.Groups.getById(context.group.id, {
                useMaster: true,
                force: true
            });
        });
}

function prepare(context) 
{
    return P.resolve()
        .then(() => {
            context.persons = _.reduce(context.persons, (memo, id) => {
                memo.push({
                    id
                });
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
                id_company  : context.idCompany,
                description : context.name
            };

            return Models.Groups.create(data, {
                persons : context.persons
            });
        })
        .then(model => {
            Models.Companies.cacheClean(context.idCompany);
            Models.Persons.cacheClean();
            Models.Groups.cacheClean();
            context.group = model;
            return model;
        });
}

module.exports = handle;
