"use strict";

const _      = require('lodash');
const P      = require('bluebird');
const sha256 = require('sha256');
const Config = require('../utilities/config');
const Base   = require('./parents/attributable');

const OMIT_OPTIONS     = Config('Database.Options.OmitOptions', ['attributes', 'where', 'order', 'group', 'limit', 'offset']);
const DEFAULT_FIELD_ID = Config('Database.Options.DefaultFieldId', 'id');
const MODEL_NAME       = 'user';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getAll(options)
    {
        options = options || {};

        return this.query(this.queries.Users.all(options.limit || 0, options.offset || 0), options).then(models => {
            return this.mapping(models, DEFAULT_FIELD_ID, _.omit(options, OMIT_OPTIONS));
        });
    }

    getByCompany(idCompany, options)
    {
        options = options || {};

        return this.query(this.queries.Users.byCompany(idCompany, options.limit || 0, options.offset || 0), options).then(models => {
            return this.mapping(models, DEFAULT_FIELD_ID, _.omit(options, OMIT_OPTIONS));
        });
    }

    getByEmail(email, options)
    {
        return this.queryOne(this.queries.Users.byEmail(email), options).then(model => {
            if (!model) {
                return P.resolve();
            }
            return this.populate(model, options);
        });
    }

    getByIds(ids, options)
    {
        return this.query(this.queries.Users.byIds(ids), options).then(models => {
            return this.mapping(models, DEFAULT_FIELD_ID, _.omit(options, OMIT_OPTIONS));
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
                return this.queryOne(this.queries.Users.byIdAndPassword(model.id, password));
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
                    context.user = model;
                    return context;
                });
            })
            .then(() => {
                return this.models.UserTokens.getById(context.user.id, 'id_user').then(token => {
                    if (!token) {
                        return this.createUserToken(context.user).then(token => {
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
                    
                    token = sha256(`user.id.${context.user.id}.created_at.${new Date()}`);
                    optionsPrepared.transaction = transaction;

                    return P.bind(this)
                        .then(() => {
                            let data = {
                                token
                            };

                            return this.models.UserTokens.update(data, context.token.id, optionsPrepared);
                        })
                        .then(() => {
                            let data = {
                                id_user_status : this.models.UserStatuses.NEED_PASSWORD
                            };

                            return this.models.Users.update(data, context.user.id, optionsPrepared);
                        });
                });
            })
            .then(() => {
                return this.getById(context.user.id, options).then(model => {
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
                if (!options.idCompany) {
                    return model;
                }

                let data = {
                    id_user    : model.id,
                    id_company : options.idCompany
                };

                return this.models.UserCompanies.create(data).then(() => {
                    return model;
                });
            })
            .then(model => {
                if (!options.idPermission) {
                    return model;
                }

                let data = {
                    id_user       : model.id,
                    id_permission : options.idPermission
                };

                return this.models.UserPermissions.create(data).then(() => {
                    return model;
                });
            })
            .then(model => {
                return this.createUserToken(model).then(token => {
                    model.token = token.token;
                    return model;
                });
            });
    }

    updateWithAttributesWithoutTransaction(data, id, attributes, options)
    {
        options = options || {};

        return P.bind(this)
            .then(() => {
                return super.updateWithAttributesWithoutTransaction(data, id, attributes, options);
            })
            .then(model => {
                if (!options.idPermission) {
                    return model;
                }

                return this.models.UserPermissions.getByUser(model.id).then(userPermission => {
                    if (userPermission.id_permission === options.idPermission) {
                        return model;
                    }

                    let data = {
                        id_permission: options.idPermission
                    };

                    return this.models.UserPermissions.update(data, userPermission.id).then(userPermission => {
                        return model;
                    });
                });
            });
    }

    createUserToken(user)
    {
        return P.bind(this)
            .then(() => {
                let token = sha256(`user.id.${user.id}.created_at.${new Date()}`);
                let data = {
                    id_user : user.id,
                    token
                };

                return this.models.UserTokens.create(data);
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
                if (options.small) {
                    return model;
                }
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
                if (options.small || options.withoutCompany) {
                    return model;
                }
                return this.models.Companies.getByUser(model.id).then(company => {
                    model.company = company;
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
        if (options.withCode) {
            cacheKey = `${cacheKey}.with_code`;
        }
        return cacheKey;
    }
}

module.exports = new Model;
