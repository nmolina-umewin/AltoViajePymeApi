'use strict';

const sequelize = require('sequelize');

const MODEL_NAME = 'companyWallet';
const TABLE_NAME = 'company_wallets';

module.exports = {
    name: MODEL_NAME,
    attributes: {
        id: {
            type: sequelize.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_company: sequelize.INTEGER(10).UNSIGNED,
        points: {
            type: sequelize.DECIMAL(16, 4),
            defaultValue: 0
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
