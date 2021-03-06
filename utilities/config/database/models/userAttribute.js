'use strict';

const sequelize = require('sequelize');

const MODEL_NAME = 'userAttribute';
const TABLE_NAME = 'user_attributes';

module.exports = {
    name: MODEL_NAME,
    attributes: {
        id: {
            type: sequelize.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_user: sequelize.BIGINT(20).UNSIGNED,
        id_attribute: sequelize.INTEGER(10).UNSIGNED,
        description: sequelize.STRING,
        active: {
            type: sequelize.INTEGER,
            defaultValue: 1
        },
        created_at: {
            type: sequelize.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
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
