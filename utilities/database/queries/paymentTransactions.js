"use strict";

module.exports = {
    byCompany          : function(idCompany, limit = 0, offset = 0) {
        return `SELECT id FROM payment_transactions WHERE id_company = ${idCompany} ORDER BY id DESC, created_at DESC` + (limit ? ` LIMIT ${limit}` : '') + (offset ? ` OFFSET ${offset}` : '');
    },
    byCompanyAndStatus : function(idCompany, idStatus, limit = 0, offset = 0) {
        return `SELECT id FROM payment_transactions WHERE id_company = ${idCompany} AND id_payment_transaction_status = ${idStatus} ORDER BY id DESC, created_at DESC` + (limit ? ` LIMIT ${limit}` : '') + (offset ? ` OFFSET ${offset}` : '');
    }
};
