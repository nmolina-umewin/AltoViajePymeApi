"use strict";

const P         = require('bluebird');
const Models    = require('../../../../models');
const Payments  = require('../../../../services/payments');

function processRemote(context) 
{
    return P.resolve()
        .then(() => {
            let options = {
                id_company: context.company.id,
                id_user: context.user.id,
                payload: context.payload
            };

            return Payments.payment(context.operator.id, options);
        })
        .then(res => {
            let data = {
                id_company: context.company.id,
                id_user: context.user.id,
                id_operator: context.operator.id,
                id_payment_transaction_status: Models.PaymentTransactionStatuses.PENDING,
                description: JSON.stringify(res),
                amount: context.payload.amount
            };

            return Models.PaymentTransactions.create(data);
        })
        .then(model => {
            let data = {
                id_payment_transaction_status: Models.PaymentTransactionStatuses.APPROVED
            };

            return Models.PaymentTransactions.update(data, model.id, {
                status: Models.PaymentTransactionStatuses.APPROVED,
                id_company: context.company.id
            })
            .then(() => {
                return model;
            });
        });
}

module.exports = processRemote;
