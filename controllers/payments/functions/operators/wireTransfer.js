"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../../models');
const Utilities = require('../../../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

const CONFIGURATION_OPERATOR_WIDE_TRANSFER = 'operators.wire_transfer.';

function processWideTransfer(context) 
{
    return P.resolve()
        .then(() => {
            return getConfigurations(context);
        })
        .then(() => {
            return validate(context);
        })
        .then(() => {
            return process(context);
        });
}

function getConfigurations(context) 
{
    return Models.Configurations.getByKey(`%${CONFIGURATION_OPERATOR_WIDE_TRANSFER}%`).then(configurations => {
        if (!configurations || !configurations.length) {
            Log.Error(`Configurations for key ${CONFIGURATION_OPERATOR_WIDE_TRANSFER} not found.`);
            return P.reject(Errors.NotExists.Configurations);
        }

        context.data = {};

        _.each(configurations, configuration => {
            context.data[configuration.configuration.replace(CONFIGURATION_OPERATOR_WIDE_TRANSFER, '')] = configuration.description;
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
                id_operation_transaction_status: Models.OperationTransactionStatuses.PENDING,
                description: JSON.stringify(context.data),
                amount: context.payload.amount
            };

            return Models.OperationTransactions.create(data);
        });
}

module.exports = processWideTransfer;
