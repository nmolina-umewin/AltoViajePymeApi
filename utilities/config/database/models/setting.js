'use strict';

const sequelize = require('sequelize');

const MODEL_NAME = 'setting';
const TABLE_NAME = 'settings';

module.exports = {
    name: MODEL_NAME,
    attributes: {
        id: {
            type: sequelize.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        setting_key: sequelize.STRING,
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
