'use strict';

const sequelize = require('sequelize');

const MODEL_NAME = 'rechargePaymentOrderTransaction';
const TABLE_NAME = 'recharge_payment_order_transactions';

module.exports = {
    name: MODEL_NAME,
    attributes: {
        id: {
            type: sequelize.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_recharge_payment_order: sequelize.BIGINT(20).UNSIGNED,
        id_recharge_transaction: sequelize.BIGINT(20).UNSIGNED
    },
    options: {
        tableName: TABLE_NAME,
        timestamps: false,
        paranoid: false,
        underscored: false,
        freezeTableName: true
    }
};
