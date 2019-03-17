"use strict";

const _      = require('lodash');
const P      = require('bluebird');
const async  = require('async');
const Base = require('./parents/model');

const MODEL_NAME = 'rechargeTransaction';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    populate(model, options)
    {
        options = options || {};

        return P.bind(this)
            .then(() => {
                return super.populate(model);
            })
            .then(() => {
                model.details = JSON.parse(model.description);
                return model;
            })
            .then(() => {
                return this.models.Users.getById(model.id_user).then(user => {
                    model.user = user;
                    delete model.id_user;
                    return model;
                });
            })
            .then(() => {
                if (options.withoutCompany) {
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
