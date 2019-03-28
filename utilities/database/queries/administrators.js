"use strict";

module.exports = {
    byEmail         : function(email) {
        return `SELECT a.* FROM administrators AS a JOIN administrator_attributes AS t ON t.id_administrator = a.id AND t.id_attribute = 103 AND t.description = '${email}' WHERE a.deleted_at IS NULL`;
    },
    byIdAndPassword : function(id, password) {
        return `SELECT a.* FROM administrators AS a JOIN administrator_attributes AS t ON t.id_administrator = a.id AND t.id_attribute = 104 AND t.description = '${password}' WHERE a.id = ${id} AND a.deleted_at IS NULL`;
    }
};
