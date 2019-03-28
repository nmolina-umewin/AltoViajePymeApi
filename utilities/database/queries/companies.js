"use strict";

module.exports = {
    byUser      : function(idUser) {
        return `SELECT c.* FROM user_companies AS uc JOIN companies AS c ON c.id = uc.id_company WHERE uc.id_user = ${idUser}`;
    },
    byCuit      : function(cuit) {
        return `SELECT c.* FROM company_attributes AS ca JOIN companies AS c ON c.id = ca.id_company WHERE ca.id_attribute = 105 AND ca.description = ${cuit}`;
    },
    byEmail     : function(email) {
        return `SELECT c.* FROM companies AS c JOIN company_attributes AS a ON a.id_company = c.id AND a.id_attribute = 103 AND a.description = '${email}' WHERE c.deleted_at IS NULL`;
    },
    usersCount  : function(idCompany) {
        return `SELECT COUNT(u.id) AS total FROM users AS u JOIN user_companies AS c ON c.id_user = u.id AND c.id_company = ${idCompany} WHERE u.deleted_at IS NULL`;
    },
    personsCount : function(idCompany) {
        return `SELECT COUNT(id) AS total FROM persons WHERE id_company = ${idCompany} AND deleted_at IS NULL`;
    }
};
