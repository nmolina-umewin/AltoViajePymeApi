"use strict";

module.exports = {
    byUser : function(idUser) {
        return `SELECT c.* FROM user_companies AS uc JOIN companies AS c ON c.id = uc.id_company WHERE uc.id_user = ${idUser}`;
    },
    usersCount : function(idCompany) {
        return `SELECT COUNT(u.id) AS total FROM users AS u JOIN user_companies AS c ON c.id_user = u.id AND c.id_company = ${idCompany} WHERE u.deleted_at IS NULL`;
    },
    personsCount : function(idCompany) {
        return `SELECT COUNT(id) AS total FROM persons WHERE id_company = ${idCompany} AND deleted_at IS NULL`;
    }
};
