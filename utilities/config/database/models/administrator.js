'use strict';

const sequelize = require('sequelize');

const MODEL_NAME = 'administrator';
const TABLE_NAME = 'administrators';

module.exports = {
    name: MODEL_NAME,
    attributes: {
        id: {
            type: sequelize.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_administrator_permission: sequelize.INTEGER(10).UNSIGNED,
        code: sequelize.STRING,
        active: {
            type: sequelize.INTEGER,
            defaultValue: 0
        },
        created_at: {
            type: sequelize.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: sequelize.DATE,
            defaultValue: null
        },
        deleted_at: {
            type: sequelize.DATE,
            defaultValue: null
        }
    },
    options: {
        tableName: TABLE_NAME,
        timestamps: false,
        paranoid: false,
        underscored: false,
        freezeTableName: true
    }
};
