"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../../models');
const Utilities = require('../../../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

const SETTING_OPERATOR_WIDE_TRANSFER = 'operators.wire_transfer.';

function processWideTransfer(context) 
{
    return P.resolve()
        .then(() => {
            return getSettings(context);
        })
        .then(() => {
            return validate(context);
        })
        .then(() => {
            return process(context);
        });
}

function getSettings(context) 
{
    return Models.Settings.getByKey(`%${SETTING_OPERATOR_WIDE_TRANSFER}%`).then(settings => {
        if (!settings || !settings.length) {
            Log.Error(`Settings for key ${SETTING_OPERATOR_WIDE_TRANSFER} not found.`);
            return P.reject(Errors.NotExists.Settings);
        }

        context.data = {};

        _.each(settings, setting => {
            context.data[setting.setting_key.replace(SETTING_OPERATOR_WIDE_TRANSFER, '')] = setting.description;
        });
        return context;
    });
}

function validate(context) 
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context.data)) {
            Log.Error('Wide transfer data not found.');
            return reject(new Errors.NotFound('Wide transfer data not found.'));
        }
        else if (_.isEmpty(context.data.cbu)) {
            Log.Error('Wide transfer CBU not found.');
            return reject(new Errors.NotFound('Wide transfer CBU not found.'));
        }
        return resolve(context);
    });
}

function process(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                id_company: context.company.id,
                id_user: context.user.id,
                id_operator: context.operator.id,
                id_payment_transaction_status: Models.PaymentTransactionStatuses.PENDING,
                description: JSON.stringify(context.data),
                amount: context.payload.amount
            };

            return Models.PaymentTransactions.create(data);
        });
}

module.exports = processWideTransfer;
