'use strict';

const sequelize = require('sequelize');

const MODEL_NAME = 'userToken';
const TABLE_NAME = 'user_tokens';

module.exports = {
    name: MODEL_NAME,
    attributes: {
        id: {
            type: sequelize.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_user: sequelize.BIGINT(20).UNSIGNED,
        token: sequelize.STRING,
        created_at: {
            type: sequelize.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
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
