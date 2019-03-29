"use strict";

const _      = require('lodash');
const P      = require('bluebird');
const Config = require('../utilities/config');
const Base   = require('./parents/model');

const OMIT_OPTIONS     = Config('Database.Options.OmitOptions', ['attributes', 'where', 'order', 'group', 'limit', 'offset']);
const DEFAULT_FIELD_ID = Config('Database.Options.DefaultFieldId', 'id');
const MODEL_NAME       = 'operationTransaction';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getByCompany(idCompany, options)
    {
        options = options || {};

        return this.query(this.queries.OperationTransactions.byCompany(idCompany, options.limit || 0), options).then(models => {
            return this.mapping(models, DEFAULT_FIELD_ID, _.omit(options, OMIT_OPTIONS));
        });
    }

    getByCompanyAndStatus(idCompany, idStatus, options)
    {
        options = options || {};

        return this.query(this.queries.OperationTransactions.byCompanyAndStatus(idCompany, idStatus, options.limit || 0), options).then(models => {
            return this.mapping(models, DEFAULT_FIELD_ID, _.omit(options, OMIT_OPTIONS));
        });
    }

    update(data, id, options, repeat = 0)
    {
        return this.transaction(transaction => {
            let optionsPrepared = _.extend({}, options || {}, {
                transaction
            });

            return P.bind(this)
                .then(() => {
                    return super.update(data, id, optionsPrepared);
                })
                .then(() => {
                    return super.getById(id, _.extend({}, optionsPrepared || {}, {
                        useMaster: true,
                        force: true
                    }));
                })
                .then(model => {
                    if (optionsPrepared.status !== this.models.OperationTransactionStatuses.APPROVED || !optionsPrepared.id_company) {
                        return model;
                    }

                    let optionsGet = _.defaults({
                        useMaster: true,
                        force: true
                    }, optionsPrepared);

                    return this.models.CompanyWallets.getById(optionsPrepared.id_company, 'id_company', optionsGet).then(wallet => {
                        let values = {
                            points: wallet.points + model.amount
                        };

                        return this.models.CompanyWallets.update(values, wallet.id, optionsPrepared);
                    })
                    .then(() => {
                        return model;
                    });
                });
        })
        .catch(error => {
            if (repeat < 5) {
                return this.update(data, id, options, repeat + 1);
            }
            throw error;
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
                if (options.small || options.withoutDetails) {
                    return model;
                }
                model.details = JSON.parse(model.description);
                return model;
            })
            .then(() => {
                return this.models.OperationTransactionStatuses.getById(model.id_operation_transaction_status).then(status => {
                    model.status = status;
                    delete model.id_operation_transaction_status;
                    return model;
                });
            })
            .then(() => {
                return this.models.Operators.getById(model.id_operator, options).then(operator => {
                    model.operator = operator;
                    delete model.id_operator;
                    return model;
                });
            })
            .then(() => {
                return this.models.Users.getById(model.id_user, options).then(user => {
                    model.user = user;
                    delete model.id_user;
                    return model;
                });
            })
            .then(() => {
                if (options.small || options.withoutCompany) {
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

        if (options.small) {
            cacheKey = `${cacheKey}.small`;
        }
        if (options.withoutCompany) {
            cacheKey = `${cacheKey}.without_company`;
        }
        if (options.withoutDetails) {
            cacheKey = `${cacheKey}.without_details`;
        }
        return cacheKey;
    }
}

module.exports = new Model;
