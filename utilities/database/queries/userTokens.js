"use strict";

module.exports = {
    byToken : function(token) {
        return `SELECT u.id AS id_user FROM users AS u JOIN user_tokens AS t ON t.id_user = u.id AND t.created_at >= NOW() - INTERVAL 1 DAY AND t.token = '${token}' WHERE u.id_user_status in (1, 2) AND u.deleted_at IS NULL`;
    }
};
