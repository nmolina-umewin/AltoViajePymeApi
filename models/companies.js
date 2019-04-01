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

    getAllAvailablePoints(idUser, options)
    {
        return this.queryOne(this.queries.Companies.allAvailablePoints(), options).then(totals => {
            if (!totals || !totals.total) {
                return P.resolve(0);
            }
            return totals.total;
        });
    }

    getByUser(idUser, options)
    {
        return this.queryOne(this.queries.Companies.byUser(idUser), options).then(model => {
            if (!model) {
                return P.resolve();
            }
            return this.populate(model, options);
        });
    }

    getByCuit(cuit, options)
    {
        return this.queryOne(this.queries.Companies.byCuit(cuit), options).then(model => {
            if (!model) {
                return P.resolve();
            }
            return this.populate(model, options);
        });
    }

    getByEmail(email, options)
    {
        return this.queryOne(this.queries.Companies.byEmail(email), options).then(model => {
            if (!model) {
                return P.resolve();
            }
            return this.populate(model, options);
        });
    }

    createWithAttributesWithoutTransaction(data, attributes, options)
    {
        options = options || {};

        return P.bind(this)
            .then(() => {
                return super.createWithAttributesWithoutTransaction(data, attributes, options);
            })
            .then(model => {
                let data = {
                    id_company : model.id,
                    points     : 0
                };

                return this.models.CompanyWallets.create(data).then(wallet => {
                    model.wallet = wallet;
                    return model;
                });
            });
    }

    populate(model, options)
    {
        options = options || {};

        return P.bind(this)
            .then(() => {
                return super.populate(model);
            })
            .then(() => {
                if (!options.withCode) {
                    delete model.code;
                }
                return model;
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

    cacheKey(key, options) {
        let cacheKey = super.cacheKey(key, options);

        if (options.withCode) {
            cacheKey = `${cacheKey}.with_code`;
        }
        return cacheKey;
    }
}

module.exports = new Model;
