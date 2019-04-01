"use strict";

module.exports = {
    byCompany          : function(idCompany, limit = 0) {
        return `SELECT id FROM recharge_transactions WHERE id_company = ${idCompany} ORDER BY id DESC, created_at DESC` + (limit ? ` LIMIT ${limit}` : '');
    },
    allPendingPayments : function() {
        return 'SELECT SUM(t.points) AS total FROM recharge_transactions AS t WHERE id_recharge_transaction_status in (1, 2) AND id_recharge_transaction_situation = 1';
    },
};
