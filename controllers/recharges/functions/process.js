"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../models');

const TRANSACTION_RECHARGE = 1;
const TRANSACTION_REVERSE  = 2;

const RECHARGE_REMOTE_STATUS_PENDING  = 1;
const RECHARGE_REMOTE_STATUS_PAYED    = 2;
const RECHARGE_REMOTE_STATUS_DONE     = 3;
const RECHARGE_REMOTE_STATUS_REFUNDED = 4;
const RECHARGE_REMOTE_STATUS_CANCELED = 5;
const RECHARGE_REMOTE_STATUS_FAIL     = 6;
const RECHARGE_REMOTE_STATUS_RECHARGE = 7;

function processRechargeTransactions(context) 
{
    return P.resolve()
        .then(() => {
            //             I  D  F    (I = incomplete, C = done, F = fail)
            let results = [0, 0, 0];
            let details = {
                persons: []
            };
            let recharge = {
                id_company: context.company.id,
                id_user: context.user.id,
                points: context.total
            };

            _.each(context.transactions.results || [], record => {
                if (record.error) {
                    details.persons.push({
                        request: record.request,
                        error: record.error
                    });
                    //      2 FAIL
                    results[2] += 1;
                    return;
                }

                let transaction = record.transaction;
                let person = {
                    id_person               : context.persons[transaction.description.request.cardNumber].id,
                    id_transaction          : transaction.id_transaction,
                    id_transaction_internal : transaction.id,
                    id_transaction_external : transaction.id_transaction_external,
                    number                  : transaction.description.request.cardNumber,
                    amount                  : transaction.amount,
                    status                  : transaction.description.status,
                    created_at              : transaction.created_at
                };

                switch(transaction.id_recharge_type) {
                    case TRANSACTION_RECHARGE:
                        person.recharge = transaction.id_recharge_status === RECHARGE_REMOTE_STATUS_DONE;
                        person.reverse  = false;
                        recharge.points += person.recharge ? 0 : -transaction.amount;
                        //                  1 = DONE, 2 FAIL
                        results[person.recharge ? 1 : 2] += 1;
                        person.id_recharge_transaction_status = person.recharge ? Models.RechargeTransactionStatuses.DONE : Models.RechargeTransactionStatuses.FAIL;
                        break;

                    case TRANSACTION_REVERSE:
                    default:
                        person.recharge  = transaction.id_recharge_status === RECHARGE_REMOTE_STATUS_RECHARGE;
                        person.reverse   = transaction.id_recharge_status === RECHARGE_REMOTE_STATUS_DONE || transaction.id_recharge_status === RECHARGE_REMOTE_STATUS_RECHARGE;
                        recharge.points += person.recharge ? 0 : -transaction.amount;
                        //                        1 = DONE,  0 INCOMPLETE, 2 FAIL
                        results[person.recharge ? 1 : person.reverse ? 0 : 2] += 1;
                        person.id_recharge_transaction_status = person.recharge ? Models.RechargeTransactionStatuses.DONE : person.reverse ? Models.RechargeTransactionStatuses.INCOMPLETE : Models.RechargeTransactionStatuses.FAIL;
                        break;
                }
                details.persons.push(person);
            });

            recharge.id_recharge_transaction_status = results[2] > 0 ? Models.RechargeTransactionStatuses.FAIL : results[0] > 0 ? Models.RechargeTransactionStatuses.INCOMPLETE : Models.RechargeTransactionStatuses.DONE;
            details.results = {
                incomplete: results[0],
                done: results[1],
                fail: results[2]
            };

            if (context.transactions.error) {
                details.error = `${context.transactions.error}`;
            }
            recharge.description = JSON.stringify(details);
            return recharge;
        });
}

module.exports = processRechargeTransactions;
