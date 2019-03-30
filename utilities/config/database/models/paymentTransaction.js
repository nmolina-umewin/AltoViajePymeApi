'use strict';

const sequelize = require('sequelize');

const MODEL_NAME = 'paymentTransaction';
const TABLE_NAME = 'payment_transactions';

module.exports = {
    name: MODEL_NAME,
    attributes: {
        id: {
            type: sequelize.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_company: sequelize.INTEGER(10).UNSIGNED,
        id_user: sequelize.BIGINT(20).UNSIGNED,
        id_operator: sequelize.INTEGER(10).UNSIGNED,
        id_payment_transaction_status: sequelize.INTEGER(10).UNSIGNED,
        amount: {
            type: sequelize.DECIMAL(16, 4),
            defaultValue: 0
        },
        description: sequelize.STRING,
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
