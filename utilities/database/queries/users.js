"use strict";

module.exports = {
    all             : function(entity) {
        return 'SELECT id FROM users ORDER BY id, created_at, updated_at DESC';
    },
    byCompany       : function(idCompany) {
        return `SELECT u.id FROM users AS u JOIN user_companies AS c ON c.id_user = u.id AND c.id_company = ${idCompany} ORDER BY u.id, u.created_at, u.updated_at DESC`;
    },
    byEmail         : function(email) {
        return `SELECT u.* FROM users AS u JOIN user_attributes AS a ON a.id_user = u.id AND a.id_attribute = 103 AND a.description = '${email}'`;
    },
    byIdAndPassword : function(id, password) {
        return `SELECT u.* FROM users AS u JOIN user_attributes AS a ON a.id_user = u.id AND a.id_attribute = 104 AND a.description = '${password}' WHERE u.id = ${id}`;
    }
};
