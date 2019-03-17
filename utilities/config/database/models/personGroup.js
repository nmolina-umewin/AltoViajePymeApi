'use strict';

const sequelize = require('sequelize');

const MODEL_NAME = 'personGroup';
const TABLE_NAME = 'person_groups';

module.exports = {
    name: MODEL_NAME,
    attributes: {
        id: {
            type: sequelize.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_person: sequelize.BIGINT(20).UNSIGNED,
        id_group: sequelize.BIGINT(20).UNSIGNED,
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
