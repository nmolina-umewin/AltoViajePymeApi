"use strict";

module.exports = {
    byToken : function(token) {
        return `SELECT a.id AS id_administrator FROM administrators AS a JOIN administrator_tokens AS t ON t.id_administrator = a.id AND t.created_at >= NOW() - INTERVAL 1 DAY AND t.token = '${token}' WHERE a.deleted_at IS NULL`;
    }
};
