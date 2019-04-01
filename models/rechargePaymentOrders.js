"use strict";

const _      = require('lodash');
const P      = require('bluebird');
const async  = require('async');
const Config = require('../utilities/config');
const Base   = require('./parents/model');

const OMIT_OPTIONS     = Config('Database.Options.OmitOptions', ['attributes', 'where', 'order', 'group', 'limit', 'offset']);
const DEFAULT_FIELD_ID = Config('Database.Options.DefaultFieldId', 'id');
const MODEL_NAME       = 'rechargePaymentOrder';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
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
                    return new P((resolve, reject) => {
                        async.each(optionsPrepared.ids, (id, next) => {
                            let data = {
                                id_recharge_payment_order : model.id,
                                id_recharge_transaction: id
                            };

                            return this.models.RechargePaymentOrderTransactions.create(data).then(() => next()).catch(next);
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
                if (options.small || options.withoutDetails) {
                    return model;
                }
                model.details = JSON.parse(model.description);
                return model;
            })
            .then(() => {
                return this.models.RechargePaymentOrderStatuses.getById(model.id_recharge_payment_order_status).then(status => {
                    model.status = status;
                    delete model.id_recharge_payment_order_status;
                    return model;
                });
            })
            .then(() => {
                let options = {
                    id_recharge_payment_order: model.id
                };

                return this.models.RechargePaymentOrderTransactions.getAllByOrder(model.id, options).then(transactions => {
                    model.transactions = transactions;
                    return model;
                });
            });
    }

    cacheKey(key, options) {
        let cacheKey = super.cacheKey(key, options);

        if (options.small) {
            cacheKey = `${cacheKey}.small`;
        }
        if (options.withoutDetails) {
            cacheKey = `${cacheKey}.without_details`;
        }
        return cacheKey;
    }
}

module.exports = new Model;
