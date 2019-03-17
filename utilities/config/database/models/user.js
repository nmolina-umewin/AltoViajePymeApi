'use strict';

const sequelize = require('sequelize');

const MODEL_NAME = 'user';
const TABLE_NAME = 'users';

module.exports = {
    name: MODEL_NAME,
    attributes: {
        id: {
            type: sequelize.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_user_status: {
            type: sequelize.INTEGER(10).UNSIGNED,
            defaultValue: 1
        },
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
