"use strict";

module.exports = {
    byCompany          : function(idCompany, limit = 0) {
        return `SELECT id FROM operation_transactions WHERE id_company = ${idCompany} ORDER BY id DESC, created_at DESC` + (limit ? ` LIMIT ${limit}` : '');
    },
    byCompanyAndStatus : function(idCompany, idStatus, limit = 0) {
        return `SELECT id FROM operation_transactions WHERE id_company = ${idCompany} AND id_operation_transaction_status = ${idStatus} ORDER BY id DESC, created_at DESC` + (limit ? ` LIMIT ${limit}` : '');
    }
};
