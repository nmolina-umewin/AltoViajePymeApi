'use strict';

const sequelize = require('sequelize');

const MODEL_NAME = 'rechargeTransaction';
const TABLE_NAME = 'recharge_transactions';

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
        description: sequelize.STRING,
        points: {
            type: sequelize.DECIMAL(16, 4),
            defaultValue: 0
        },
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
