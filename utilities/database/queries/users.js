"use strict";

module.exports = {
    all             : function() {
        return 'SELECT id FROM users WHERE deleted_at IS NULL ORDER BY id DESC, created_at DESC, updated_at DESC';
    },
    byCompany       : function(idCompany) {
        return `SELECT u.id FROM users AS u JOIN user_companies AS c ON c.id_user = u.id AND c.id_company = ${idCompany} WHERE u.deleted_at IS NULL ORDER BY u.id DESC, u.created_at DESC, u.updated_at DESC`;
    },
    byEmail         : function(email) {
        return `SELECT u.* FROM users AS u JOIN user_attributes AS a ON a.id_user = u.id AND a.id_attribute = 103 AND a.description = '${email}' WHERE u.deleted_at IS NULL`;
    },
    byIds           : function(ids) {
        return `SELECT id FROM users WHERE id IN (${ids}) AND deleted_at IS NULL ORDER BY id DESC, created_at DESC, updated_at DESC`;
    },
    byIdAndPassword : function(id, password) {
        return `SELECT u.* FROM users AS u JOIN user_attributes AS a ON a.id_user = u.id AND a.id_attribute = 104 AND a.description = '${password}' WHERE u.id = ${id} AND u.deleted_at IS NULL`;
    }
};
