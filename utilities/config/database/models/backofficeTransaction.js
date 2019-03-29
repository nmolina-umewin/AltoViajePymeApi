'use strict';

const sequelize = require('sequelize');

const MODEL_NAME = 'backofficeTransaction';
const TABLE_NAME = 'backoffice_transactions';

module.exports = {
    name: MODEL_NAME,
    attributes: {
        id: {
            type: sequelize.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_administrator: sequelize.BIGINT(20).UNSIGNED,
        id_backoffice_transaction_type: sequelize.INTEGER(10).UNSIGNED,
        description: sequelize.STRING,
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
