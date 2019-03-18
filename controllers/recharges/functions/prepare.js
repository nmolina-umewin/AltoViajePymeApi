"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Utilities = require('../../../utilities');
const Log       = Utilities.Log;

function prepareRechargeTransaction(context) 
{
    return P.resolve()
        .then(() => {
            return prepare(context);
        })
        .then(() => {
            return validate(context);
        });
}

function prepare(context)
{
    return P.resolve()
        .then(() => {
            context.total = 0;
            context.payload = _.map(context.payload, (model, index) => {
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
            return context;
        });
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (context.total === 0) {
            Log.Error('Bad request invalid amount.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid amount.', {
                status: 'invalid_amounts'
            }));
        }

        if (context.company.wallet.points < context.total) {
            Log.Error('Bad request insufficient points.');
            return reject(new Utilities.Errors.BadRequest('Bad request invalid id company.', {
                status: 'insufficient_points'
            }));
        }
        return resolve(context);
    });
}

module.exports = prepareRechargeTransaction;
