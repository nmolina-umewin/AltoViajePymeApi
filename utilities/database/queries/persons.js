"use strict";

module.exports = {
    all               : function() {
        return 'SELECT id FROM persons WHERE deleted_at IS NULL ORDER BY id DESC, created_at DESC, updated_at DESC';
    },
    byCompany         : function(idCompany) {
        return `SELECT id FROM persons WHERE id_company = ${idCompany} AND deleted_at IS NULL ORDER BY id DESC, created_at DESC, updated_at DESC`;
    },
    byCompanyAndGroup : function(idCompany, idGroup) {
        return `SELECT p.id FROM persons AS p JOIN person_groups AS g ON g.id_person = p.id AND g.id_group = ${idGroup} WHERE p.id_company = ${idCompany} AND p.deleted_at IS NULL ORDER BY p.id DESC, p.created_at DESC, p.updated_at DESC`;
    },
    byIds             : function(ids) {
        return `SELECT id FROM persons WHERE id IN (${ids}) AND deleted_at IS NULL ORDER BY id DESC, created_at DESC, updated_at DESC`;
    }
};
