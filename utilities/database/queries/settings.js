"use strict";

module.exports = {
    byKey : function(key) {
        return `SELECT * FROM settings WHERE setting_key LIKE '${key}' ORDER BY id`;
    }
};
