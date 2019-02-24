"use strict";

module.exports = {
    byUser : function(idUser) {
        return `SELECT p.* FROM user_permissions AS up JOIN permissions AS p ON p.id = up.id_permission WHERE up.id_user = ${idUser}`;
    }
};
