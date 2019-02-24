"use strict";

const P = require('bluebird');
const Base = require('./parents/attributable');
const Utilities = require('../utilities');
const Database  = Utilities.Database;

const Queries = Database.Queries.Companies;

const MODEL_NAME = 'company';
const MODEL_TABLE = 'companies';

class Model extends Base
{
    constructor() {
        super(MODEL_NAME, MODEL_TABLE);
    }

    getByUser(idUser, options) {
        return this.queryOne(Queries.byUser(idUser), options).then(company => {
            return this.populate(company);
        });
    }

    populate(model) {
        return P.bind(this)
            .then(() => {
                return super.populate(model);
            })
            .then(() => {
                return this.models.CompanyStatuses.getById(model.id_company_status).then(status => {
                    model.status = status;
                    delete model.id_company_status;
                    return model;
                });
            });
    }
}

module.exports = new Model;
