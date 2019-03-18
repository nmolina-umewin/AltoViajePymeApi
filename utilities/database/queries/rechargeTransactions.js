"use strict";

module.exports = {
    byCompany : function(idCompany, limit = 0) {
        return `SELECT id FROM recharge_transactions WHERE id_company = ${idCompany} ORDER BY id DESC, created_at DESC` + (limit ? ` LIMIT ${limit}` : '');
    }
};
