"use strict";

const P      = require('bluebird');
const async  = require('async');
const Base   = require('./parents/service');
const Config = require('../utilities/config');

const OPTIONS = Config('Service.Recharges');
const SUBE_SERVICE = 1;

class Service extends Base
{
    constructor()
    {
        super(OPTIONS);
    }

    recharge(options)
    {
        return this.post({
            uri: `/services/${SUBE_SERVICE}/recharge`,
            body: options
        });
    }

    batchRecharge(records, options)
    {
        let results = [];

        return new P(resolve => {
            async.eachSeries(records, (record, next) => {
                let result = {
                    request: record
                };

                results.push(result);

                this.recharge(record).then(transaction => {
                    result.transaction = transaction;
                    next();
                })
                .catch(error => {
                    result.error = error && error.error || error;
                    next();
                });
            }, error => {
                let response = {
                    results
                };

                if (error) {
                    response.error = error && error.error || error;
                }
                resolve(response);
            });
        });
    }
}

module.exports = new Service;
