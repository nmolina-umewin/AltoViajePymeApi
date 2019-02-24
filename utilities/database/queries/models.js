"use strict";

const _ = require('lodash');

module.exports = {
    all    : function(entity) {
        return `SELECT id FROM ${entity}`;
    },
    byId   : function(entity, id) {
        return `SELECT * FROM ${entity} WHERE id = ${id}`;
    },
    create : function(entity, data) {
        let values = [];

        _.each(data, value => {
            if (_.isString(value)) {
                return values.push(`'${value}'`);
            }
            values.push(`${value}`);
        });
        return `INSERT INTO ${entity} VALUES (${values.join(', ')})`;
    },
    update : function(entity, id, data) {
        let values = [];

        _.each(data, (value, key) => {
            if (_.isString(value)) {
                return values.push(`${_.snakeCase(key)} = '${value}'`);
            }
            values.push(`${_.snakeCase(key)} = ${value}`);
        });
        return `UPDATE ${entity} SET ${values.join(', ')} WHERE id = ${id}`;
    },
    remove : function(entity, id) {
        return `DELETE FROM ${entity} WHERE id = ${id}`;
    }
};
