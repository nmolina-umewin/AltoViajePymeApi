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

const RESULT_INDEX_INCOMPLETE = 0;
const RESULT_INDEX_DONE       = 1;
const RESULT_INDEX_FAIL       = 2;

function processRechargeTransactions(context) 
{
    return P.resolve()
        .then(() => {
            let recharge = {
                id_company: context.company.id,
                id_user: context.user.id,
                points: context.total
            };
            let details = processDetails(context, recharge);

            recharge.id_recharge_transaction_status = getRechargeTransactionStatus(details.results);

            if (context.transactions.error) {
                details.error = `${context.transactions.error}`;
            }
            recharge.description = JSON.stringify(details);
            return recharge;
        });
}

function processDetails(context, recharge)
{
    //             I  D  F    (I = incomplete, C = done, F = fail)
    let results = [0, 0, 0];
    let details = {
        persons: []
    };

    _.each(context.transactions.results || [], record => {
        if (record.error) {
            details.persons.push({
                id_person                      : context.persons[record.request.payload.cardNumber].id,
                id_recharge_transaction_status : Models.RechargeTransactionStatuses.FAIL,
                recharge                       : false,
                reverse                        : false,
                number                         : record.request.payload.cardNumber,
                amount                         : record.request.payload.amount,
                request                        : record.request,
                error                          : record.error,
                status                         : 'error'
            });
            recharge.points -= record.request.payload.amount;
            results[RESULT_INDEX_FAIL] += 1;
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
                results[person.recharge ? RESULT_INDEX_DONE : RESULT_INDEX_FAIL] += 1;
                person.id_recharge_transaction_status = person.recharge ? Models.RechargeTransactionStatuses.DONE : Models.RechargeTransactionStatuses.FAIL;
                break;

            case TRANSACTION_REVERSE:
            default:
                person.recharge  = transaction.id_recharge_status === RECHARGE_REMOTE_STATUS_RECHARGE;
                person.reverse   = transaction.id_recharge_status === RECHARGE_REMOTE_STATUS_DONE || transaction.id_recharge_status === RECHARGE_REMOTE_STATUS_RECHARGE;
                recharge.points += person.recharge ? 0 : -transaction.amount;
                results[person.recharge ? RESULT_INDEX_DONE : person.reverse ? RESULT_INDEX_INCOMPLETE : RESULT_INDEX_FAIL] += 1;
                person.id_recharge_transaction_status = person.recharge ? Models.RechargeTransactionStatuses.DONE : person.reverse ? Models.RechargeTransactionStatuses.INCOMPLETE : Models.RechargeTransactionStatuses.FAIL;
                break;
        }
        details.persons.push(person);
    });

    details.results = {
        incomplete : results[RESULT_INDEX_INCOMPLETE],
        done       : results[RESULT_INDEX_DONE],
        fail       : results[RESULT_INDEX_FAIL]
    };
    return details;
}

function getRechargeTransactionStatus(results)
{
    if (results.done) {
        if (results.incomplete || results.fail) {
            return Models.RechargeTransactionStatuses.INCOMPLETE;
        }
        return Models.RechargeTransactionStatuses.DONE;
    }
    else if (results.incomplete) {
        return Models.RechargeTransactionStatuses.INCOMPLETE;
    }
    return Models.RechargeTransactionStatuses.FAIL;
}

module.exports = processRechargeTransactions;
