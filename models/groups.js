"use strict";

const _      = require('lodash');
const P      = require('bluebird');
const async  = require('async');
const Base   = require('./parents/model');
const Config = require('../utilities/config');

const OMIT_OPTIONS     = Config('Database.Options.OmitOptions', ['attributes', 'where', 'order', 'group', 'limit', 'offset']);
const DEFAULT_FIELD_ID = Config('Database.Options.DefaultFieldId', 'id');
const MODEL_NAME       = 'group';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getAll(idBenefit, options)
    {
        return this.query(this.queries.Groups.all(), options).then(models => {
            return this.mapping(models, DEFAULT_FIELD_ID, _.omit(options, OMIT_OPTIONS));
        });
    }

    getByCompany(idCompany, options)
    {
        return this.query(this.queries.Groups.byCompany(idCompany), options).then(models => {
            return this.mapping(models, DEFAULT_FIELD_ID, _.omit(options, OMIT_OPTIONS));
        });
    }

    create(data, options)
    {
        return this.transaction(transaction => {
            let optionsPrepared = _.extend({}, options || {}, {
                transaction
            });

            return P.bind(this)
                .then(() => {
                    return super.create(data, optionsPrepared);
                })
                .then(model => {
                    if (!optionsPrepared.persons) {
                        return model;
                    }

                    return new P((resolve, reject) => {
                        async.each(optionsPrepared.persons, (person, next) => {
                            let data = {
                                id_person : person.id,
                                id_group  : model.id
                            };

                            return this.models.PersonGroups.create(data, optionsPrepared).then(() => next()).catch(next);
                        }, error => {
                            if (error) return reject(error);
                            return resolve(model);
                        });
                    });
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
                return this.queryOne(this.queries.Groups.personsCount(model.id_company, model.id), options).then(totals => {
                    model.personsCount = totals.total;
                    return model;
                });
            })
            .then(() => {
                if (options.withoutCompany) {
                    delete model.id_company;
                    return model;
                }
                return this.models.Companies.getById(model.id_company).then(company => {
                    model.company = company;
                    delete model.id_company;
                    return model;
                });
            });
    }

    cacheKey(key, options) {
        let cacheKey = super.cacheKey(key, options);

        if (options.withoutCompany) {
            cacheKey = `${cacheKey}.without_company`;
        }
        return cacheKey;
    }
}

module.exports = new Model;
