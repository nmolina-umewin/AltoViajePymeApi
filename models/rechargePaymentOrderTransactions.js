"use strict";

const _ = require('lodash');
const P = require('bluebird');
const async = require('async');
const Base = require('./parents/model');

const MODEL_NAME = 'rechargePaymentOrderTransaction';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getAllByOrder(id, options)
    {
        options = this.prepareOptions(options);

        options.where = options.where || {};
        options.where.id_recharge_payment_order = id;

        return this.getAll(options).then(models => {
            if (_.isEmpty(models)) return [];

            return new P((resolve, reject) => {
                async.map(models, (model, next) => {
                    let optionsTransaction = {
                        withoutDetails: true,
                        withoutCompany: true
                    };

                    return this.models.RechargeTransactions.getById(model.id_recharge_transaction, optionsTransaction).then(model => {
                        return next(null, model);
                    });
                }, (error, models) => {
                    if (error) return reject(error);
                    return resolve(models);
                });
            });
        });
    }
}

module.exports = new Model;
