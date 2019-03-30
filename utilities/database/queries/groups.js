"use strict";

module.exports = {
    all          : function(limit = 0, offset = 0) {
        return 'SELECT id FROM groups ORDER BY id DESC, created_at DESC, updated_at DESC' + (limit ? ` LIMIT ${limit}` : '') + (offset ? ` OFFSET ${offset}` : '');
    },
    byCompany    : function(idCompany, limit = 0, offset = 0) {
        return `SELECT id FROM groups WHERE id_company = ${idCompany} ORDER BY id DESC, created_at DESC, updated_at DESC` + (limit ? ` LIMIT ${limit}` : '') + (offset ? ` OFFSET ${offset}` : '');
    },
    personsCount : function(idCompany, idGroup) {
        return `SELECT COUNT(p.id) AS total FROM persons AS p JOIN person_groups AS g ON g.id_person = p.id AND g.id_group = ${idGroup} WHERE p.id_company = ${idCompany} AND p.deleted_at IS NULL`;
    }
};
