"use strict";

const P         = require('bluebird');
const Models    = require('../../../models');
const Utilities = require('../../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function populateRechargeTransaction(context) 
{
    return P.resolve()
        .then(() => {
            return getEventer(context);
        })
        .then(() => {
            return getCompany(context);
        })
        .then(() => {
            return getUser(context);
        })
        .then(() => {
            return getPersons(context);
        });
}

function getEventer(context) 
{
    context.eventer = new Utilities.Eventer();
    return context;
}

function getCompany(context) 
{
    return Models.Companies.getById(context.idCompany).then(company => {
        if (!company) {
            Log.Error(`Company ${context.idCompany} not found.`);
            return P.reject(Errors.NotExists.Company);
        }
        context.company = company;
        return context;
    });
}

function getUser(context) 
{
    return Models.Users.getById(context.idUser).then(user => {
        if (!user) {
            Log.Error(`User ${context.idUser} not found.`);
            return P.reject(Errors.NotExists.User);
        }
        context.user = user;
        return context;
    });
}

function getPersons(context) 
{
    context.persons = {};

    return P.map(context.payload, model => {
        return Models.Persons.getById(Number(model.person)).then(person => {
            if (!person) {
                Log.Error(`Person ${model.person} not found.`);
                return P.reject(new Errors.BadRequest('Bad request invalid person.', {
                    status: 'invalid_person'
                }));
            }
            context.persons[person.cards[0].number] = person;
            model.person = person;
            return model;
        });
    });
}

module.exports = populateRechargeTransaction;
