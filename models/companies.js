"use strict";

const P    = require('bluebird');
const Base = require('./parents/attributable');

const MODEL_NAME = 'company';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getByUser(idUser, options)
    {
        return this.queryOne(this.queries.Companies.byUser(idUser), options).then(company => {
            return this.populate(company);
        });
    }

    populate(model)
    {
        return P.bind(this)
            .then(() => {
                return super.populate(model);
            })
            .then(() => {
                return this.queryOne(this.queries.Companies.usersCount(model.id)).then(totals => {
                    model.usersCount = totals.total;
                    return model;
                });
            })
            .then(() => {
                return this.queryOne(this.queries.Companies.personsCount(model.id)).then(totals => {
                    model.personsCount = totals.total;
                    return model;
                });
            })
            .then(() => {
                return this.models.CompanyStatuses.getById(model.id_company_status).then(status => {
                    model.status = status;
                    delete model.id_company_status;
                    return model;
                });
            })
            .then(() => {
                return this.models.CompanyWallets.getById(model.id, 'id_company').then(wallet => {
                    model.wallet = wallet;
                    delete wallet.id_company;
                    return model;
                });
            });
    }
}

module.exports = new Model;
