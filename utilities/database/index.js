"use strict";

const Config = require('../config');
const Queries = require('./queries');
const Sequelize = require('sequelize');

class Database
{
    constructor()
    {
        // Initialize Sequelize instance
        this.connection = new Sequelize(Config('Database.Connection'));
    }

    get Queries()
    {
        return Queries;
    }

    isAlive()
    {
        return this.connection.authenticate().then(() => {
            return true;
        });
    }
}

module.exports = new Database();
