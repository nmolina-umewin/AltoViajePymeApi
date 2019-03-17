"use strict";

module.exports = {
    byKey : function(key) {
        return `SELECT * FROM configurations WHERE configuration LIKE '${key}' ORDER BY id`;
    }
};
