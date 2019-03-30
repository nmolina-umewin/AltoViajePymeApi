"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Utilities = require('../../../utilities');
const validator = require('validator');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function validateOperation(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context)) {
            Log.Error('Bad request invalid payload information.');
            return reject(new Errors.BadRequest('Bad request invalid payload information.'));
        }
        else if (!context.idCompany) {
            Log.Error('Bad request invalid id company.');
            return reject(new Errors.BadRequest('Bad request invalid id company.', {
                status: 'not_company'
            }));
        }
        else if (!context.idUser) {
            Log.Error('Bad request invalid id user.');
            return reject(new Errors.BadRequest('Bad request invalid id user.', {
                status: 'not_user'
            }));
        }
        else if (!context.idOperator) {
            Log.Error('Bad request invalid id operator.');
            return reject(new Errors.BadRequest('Bad request invalid id operator.', {
                status: 'not_operator'
            }));
        }
        else if (_.isEmpty(context.payload) || !context.payload.amount) {
            Log.Error('Bad request invalid payload.');
            return reject(new Errors.BadRequest('Bad request invalid payload.', {
                status: 'not_payload'
            }));
        }
        return resolve(context);
    });
}

module.exports = validateOperation;
