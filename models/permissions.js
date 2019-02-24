"use strict";

const Base = require('./parents/model');
const Utilities = require('../utilities');
const Database  = Utilities.Database;

const Queries = Database.Queries.Permissions;

const MODEL_NAME = 'permission';

class Model extends Base
{
    constructor() {
        super(MODEL_NAME);
    }

    getByUser(idUser, options) {
        return this.query(Queries.byUser(idUser), options);
    }
}

module.exports = new Model;
