"use strict";

module.exports = {
    byUser : function(idUser) {
        return `SELECT c.* FROM user_companies AS uc JOIN companies AS c ON c.id = uc.id_company WHERE uc.id_user = ${idUser}`;
    }
};
