"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Utilities = require('../../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function validateRechargeTransaction(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context)) {
            Log.Error('Bad request invalid payload information.');
            return reject(new Errors.BadRequest('Bad request invalid payload information.'));
        }
        else if (!Utilities.Validator.isInt(context.idCompany)) {
            Log.Error('Bad request invalid id company.');
            return reject(new Errors.BadRequest('Bad request invalid id company.', {
                status: 'not_company'
            }));
        }
        else if (!Utilities.Validator.isInt(context.idUser)) {
            Log.Error('Bad request invalid id user.');
            return reject(new Errors.BadRequest('Bad request invalid id user.', {
                status: 'not_user'
            }));
        }
        else if (_.isEmpty(context.payload)) {
            Log.Error('Bad request invalid payload.');
            return reject(new Errors.BadRequest('Bad request invalid payload.', {
                status: 'not_payload'
            }));
        }
        return resolve(context);
    });
}

module.exports = validateRechargeTransaction;
