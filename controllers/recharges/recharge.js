"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const Recharges = require('../../services/recharges');
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
                return getUser(context);
            })
            .then(() => {
                return getPersons(context);
            })
            .then(() => {
                return recharge(context);
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
            Log.Error('Bad request invalid payload information.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid payload information.'));
        }
        else if (!context.idCompany) {
            Log.Error('Bad request invalid id company.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid id company.'));
        }
        else if (!context.idUser) {
            Log.Error('Bad request invalid id user.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid id user.'));
        }
        else if (_.isEmpty(context.payload)) {
            Log.Error('Bad request invalid payload.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid payload.', {
                status: 'not_persons'
            }));
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

function getUser(context) 
{
    return Models.Users.getById(context.idUser).then(user => {
        if (!user) {
            Log.Error(`User ${context.idUser} not found.`);
            return P.reject(Utilities.Errors.NotExists.User);
        }
        context.user = user;
        return context;
    });
}

function getPersons(context) 
{
    console.log(JSON.stringify(context, null, 2));
    return P.map(context.payload, model => {
        return Models.Persons.getById(Number(model.person)).then(person => {
            if (!person) {
                Log.Error(`Person ${model.person} not found.`);
                return P.reject(new Utilities.Errors.BadRequest('Bad request invalid person.', {
                    status: 'invalid_person'
                }));
            }
            model.person = person;
            return model;
        });
    });
}

function recharge(context) 
{
    return P.resolve()
        .then(() => {
            return prepare(context);
        })
        .then(() => {
            return save(context);
        })
        .then(() => {
            return Models.RechargeTransactions.getById(context.transaction.id, {
                useMaster: true,
                force: true
            });
        });
}

function prepare(context) 
{
    return P.resolve()
        .then(() => {
            context.total = 0;
            context.payload = _.map(context.payload, model => {
                model.amount = Number(model.amount);
                context.total += model.amount;

                return {
                    idCompany: context.company.id,
                    idUser: context.user.id,
                    payload: {
                        // TODO Check this when the person can count on more than one card goes up
                        cardNumber: model.person.cards[0].number,
                        amount: model.amount
                    }
                };
            });

            if (context.total === 0) {
                Log.Error('Bad request invalid amount.');
                return reject(new Utilities.Errors.BadRequest('Bad request invalid amount.', {
                    status: 'invalid_amounts'
                }));
            }

            console.log('POINTS', context.company.wallet.points);
            console.log('TOTAL', context.total);
            console.log('IS SUFFICIENT', context.company.wallet.points < context.total);

            if (context.company.wallet.points < context.total) {
                Log.Error('Bad request insufficient points.');
                return reject(new Utilities.Errors.BadRequest('Bad request invalid id company.', {
                    status: 'insufficient_points'
                }));
            }
            return context;
        });
}

function save(context) 
{
    return P.resolve()
        .then(() => {
            console.log(context.payload);
            return Recharges.batchRecharge(context.payload);
        })
        .then(transactions => {
            console.log(transactions);
            return transactions;
        })
        .then(transactions => {
            Models.Companies.cacheClean(context.idCompany);
            Models.Recharges.cacheClean();
            return transactions;
        });
}

module.exports = handle;
