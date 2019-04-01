'use strict';

const sequelize = require('sequelize');

const MODEL_NAME = 'rechargePaymentOrder';
const TABLE_NAME = 'recharge_payment_orders';

module.exports = {
    name: MODEL_NAME,
    attributes: {
        id: {
            type: sequelize.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_recharge_payment_order_status: sequelize.INTEGER(10).UNSIGNED,
        amount: {
            type: sequelize.DECIMAL(16, 4),
            defaultValue: 0
        },
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
