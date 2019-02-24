"use strict";

const _ = require('lodash');
const P = require('bluebird');
const Base = require('./parents/attributable');
const Utilities = require('../utilities');
const Database  = Utilities.Database;

const Queries = Database.Queries.Users;

const MODEL_NAME = 'user';

class Model extends Base
{
    constructor() {
        super(MODEL_NAME);
    }

    getByCompany(idCompany, options) {
        return this.query(Queries.byCompany(idCompany), options).then(models => {
            return this.mapping(models, options);
        });
    }

    getByEmail(email, options) {
        return this.queryOne(Queries.byEmail(email), options).then(model => {
            return P.resolve(this.populate(model, options));
        });
    }

    login(email, password, options) {
        return P.bind(this)
            .then(() => {
                return this.getByEmail(email);
            })
            .then(model => {
                return this.queryOne(Queries.byIdAndPassword(model.id, password));
            })
            .then(model => {
                return this.getById(model.id, options);
            });
    }

    create(data, options) {
        return P.bind(this)
            .then(() => {
                return this.create({
                    id: null,
                    id_user_status: 1
                });
            });

            // Create user attributes
            // Create user permission relationship
            // Create user company relationship
    }

    populate(model, options) {
        options = options || {};

        return P.bind(this)
            .then(() => {
                return super.populate(model);
            })
            .then(() => {
                return this.models.Permissions.getByUser(model.id).then(permissions => {
                    model.roles = _.map(permissions, 'description');
                    return model;
                });
            })
            .then(() => {
                return this.models.UserStatuses.getById(model.id_user_status).then(status => {
                    model.status = status;
                    delete model.id_user_status;
                    return model;
                });
            })
            .then(() => {
                if (options.withoutCompany) {
                    return model;
                }
                return this.models.Companies.getByUser(model.id).then(company => {
                    model.company = company;
                    return model;
                });
            });
    }
}

module.exports = new Model;
