"use strict";

const _      = require('lodash');
const P      = require('bluebird');
const sha256 = require('sha256');
const Config = require('../utilities/config');
const Base   = require('./parents/attributable');

const OMIT_OPTIONS     = Config('Database.Options.OmitOptions', ['attributes', 'where', 'order', 'group', 'limit', 'offset']);
const DEFAULT_FIELD_ID = Config('Database.Options.DefaultFieldId', 'id');
const MODEL_NAME       = 'administrator';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getByEmail(email, options)
    {
        return this.queryOne(this.queries.Administrators.byEmail(email), options).then(model => {
            if (!model) {
                return P.resolve();
            }
            return this.populate(model, options);
        });
    }

    login(email, password, options)
    {
        return P.bind(this)
            .then(() => {
                return this.getByEmail(email);
            })
            .then(model => {
                if (!model) {
                    return P.resolve();
                }
                return this.queryOne(this.queries.Administrators.byIdAndPassword(model.id, password));
            })
            .then(model => {
                if (!model) {
                    return P.resolve();
                }
                return this.getById(model.id, options);
            });
    }

    forgotPassword(email, options)
    {
        let context = {};
        let token;

        return P.bind(this)
            .then(() => {
                return this.getByEmail(email).then(model => {
                    context.administrator = model;
                    return context;
                });
            })
            .then(() => {
                return this.models.AdministratorTokens.getById(context.administrator.id, 'id_administrator').then(token => {
                    if (!token) {
                        return this.createAdministratorToken(context.administrator).then(token => {
                            context.token = token;
                            return context;
                        });
                    }
                    context.token = token;
                    return context;
                });
            })
            .then(() => {
                return this.transaction(transaction => {
                    let optionsPrepared = this.prepareWriteOptions(options);
                    
                    token = sha256(`administrator.id.${context.administrator.id}.created_at.${new Date()}`);
                    optionsPrepared.transaction = transaction;

                    return P.bind(this)
                        .then(() => {
                            let data = {
                                token
                            };

                            return this.models.AdministratorTokens.update(data, context.token.id, optionsPrepared);
                        });
                });
            })
            .then(() => {
                return this.getById(context.administrator.id, options).then(model => {
                    model.token = token;
                    return model;
                });
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
                return this.createAdministratorToken(model).then(token => {
                    model.token = token.token;
                    return model;
                });
            });
    }

    createAdministratorToken(administrator)
    {
        return P.bind(this)
            .then(() => {
                let token = sha256(`administrator.id.${administrator.id}.created_at.${new Date()}`);
                let data = {
                    id_administrator : administrator.id,
                    token
                };

                return this.models.AdministratorTokens.create(data);
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
                return this.models.AdministratorPermissions.getById(model.id_administrator_permission).then(permission => {
                    model.rol = permission.description;
                    delete model.id_administrator_permission;
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
