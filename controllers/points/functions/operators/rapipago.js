"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../../../models');
const Utilities = require('../../../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function processRapipago(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                id_company: context.company.id,
                id_user: context.user.id,
                id_operator: context.operator.id,
                id_operation_transaction_status: Models.OperationTransactionStatuses.PENDING,
                description: JSON.stringify({
                    id_numero: '1234567890',
                    cod_trx: 'R999997890123456789012',
                    barra: '12345678901234567890123456789012345678901234567890',
                    fecha_hora_operacion: '2014-09-19 15:34:56',
                    codigo_respuesta: '0',
                    msg: 'Trx ok'
                }),
                amount: context.payload.amount
            };

            return Models.OperationTransactions.create(data);
        })
        .then(model => {
            console.log(model.id);
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

module.exports = processRapipago;
