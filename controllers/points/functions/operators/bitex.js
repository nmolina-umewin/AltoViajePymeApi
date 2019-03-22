"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../../models');
const Utilities = require('../../../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function processBitex(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                id_company: context.company.id,
                id_user: context.user.id,
                id_operator: context.operator.id,
                id_operation_transaction_status: Models.OperationTransactionStatuses.PENDING,
                description: JSON.stringify({
                    data: {
                        id: '5',
                        type: 'payments',
                        attributes: {
                            amount: context.payload.amount,
                            callback_url: 'https://mystore.com/webhook',
                            confirmed_quantity: 0,
                            currency_code: 'usd',
                            customer_reference: 'Buy AV Points',
                            expected_quantity: 0.01550388,
                            keep: 10,
                            kept: null,
                            last_quoted_on: '2018-12-11T18:32:51.456Z',
                            merchant_reference: 'Sale id: 2212',
                            overpaid: null,
                            quote_valid_until: '2018-12-11T18:33:51.455Z',
                            settlement_amount: null,
                            settlement_currency: null,
                            status: 'pending',
                            unconfirmed_quantity: 0,
                            valid_until: '2018-12-11T19:32:51.440Z'
                        },
                        relationships: {
                            address: {
                                data: {
                                    id: '37',
                                    type: 'bitcoin_addresses'
                                }
                            },
                            coin_deposits: {
                                data: []
                            }
                        }
                    },
                    included: [{
                        id: '37',
                        type: 'bitcoin_addresses',
                        attributes: {
                            auto_sell: false,
                            public_address: 'n1VnZ8YBdE2iXFqMZeVoTJp5Ek2RTbdcJr'
                        },
                        relationships: {
                            user: {
                                data: {
                                    id: '5',
                                    type: 'users'
                                }
                            },
                            payment: {
                                data: {
                                    id: '5',
                                    type: 'payments'
                                }
                            }
                        }
                    }]
                }),
                amount: context.payload.amount
            };

            return Models.OperationTransactions.create(data);
        })
        .then(model => {
            let data = {
                id_operation_transaction_status: Models.OperationTransactionStatuses.APPROVED
            };

            return Models.OperationTransactions.update(data, model.id, {
                status: Models.OperationTransactionStatuses.APPROVED,
                id_company: context.company.id
            })
            .then(() => {
                return model;
            });
        });
}

module.exports = processBitex;
