'use strict';

const sequelize = require('sequelize');

const MODEL_NAME = 'userStatus';
const TABLE_NAME = 'user_statuses';

module.exports = {
    name: MODEL_NAME,
    attributes: {
        id: {
            type: sequelize.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        description: sequelize.STRING
    },
    options: {
        tableName: TABLE_NAME,
        timestamps: false,
        paranoid: false,
        underscored: false,
        freezeTableName: true
    }
};
