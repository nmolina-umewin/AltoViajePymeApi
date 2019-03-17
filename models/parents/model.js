"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const async     = require('async');
const sequelize = require('sequelize');
const Cacheable = require('./cacheable');
const Utilities = require('../../utilities');
const Config    = require('../../utilities/config');
const Database  = Utilities.Database;
const Cache     = Utilities.Cache;

const OMIT_OPTIONS          = Config('Database.Options.OmitOptions', ['attributes', 'where', 'order', 'group', 'limit', 'offset']);
const DEFAULT_FIELD_ID      = Config('Database.Options.DefaultFieldId', 'id');
const DEFAULT_WRITE_OPTIONS = Config('Database.Options.DefaultWriteOptions', {});
const DEFAULT_READ_OPTIONS  = Config('Database.Options.DefaultReadOptions', {
    raw: true,
    lazy: false,
    cache: Cache.isEnabled
});

let Models;

class BaseModel extends Cacheable
{
    constructor(model)
    {
        super();

        let { name = '', attributes = {}, options = {} } = Config(`Database.Models.${_.upperFirst(model)}`, {});

        if (!name) {
            throw new Error(`The user ${model} is not correctly configured`)
        }

        this.rawConnection = Database.connection;
        this.connection = this.rawConnection.define(name, attributes, options);
        this.name = model;
    }

    get queries()
    {
        return Database.Queries;
    }

    getAll(options)
    {
        let optionsPrepared = this.prepareOptions(options);
        let cacheKey;

        optionsPrepared.lazy = optionsPrepared.lazy != void 0 ? optionsPrepared.lazy : true;

        // Prepare cache key for read from cache
        cacheKey = this.cacheKey(`${this.cachePrefix()}.getAll`, optionsPrepared);

        // Check if need read from cache
        return this.cacheRead(cacheKey, optionsPrepared).then(cached => {
            // Check if models are cached
            if (cached) return cached;

            // Prepare options for optimizate query only selection IDs
            if (optionsPrepared.lazy) {
                optionsPrepared.attributes = optionsPrepared.attributes || [];
                optionsPrepared.attributes.push(DEFAULT_FIELD_ID);
            }

            return this.connection.findAll(optionsPrepared).then(models => {
                // Check if model not need population
                if (!models || !models.length || optionsPrepared.lazy) {
                    return models;
                }

                // If no lazy models, load attributes
                return this.mapping(models, DEFAULT_FIELD_ID, _.omit(optionsPrepared, OMIT_OPTIONS)).then(models => {
                    // Save models in cache if necesary
                    return this.cacheWrite(cacheKey, models, optionsPrepared);
                });
            });
        });
    }

    getById(id, field, options)
    {
        // Prepare arguments
        if (_.isObject(field)) {
            options = field;
            field = DEFAULT_FIELD_ID;
        }
        if (!_.isString(field)) {
            field = DEFAULT_FIELD_ID;
        }

        let optionsPrepared = this.prepareOptions(options);

        // Prepare where condition
        optionsPrepared.where = optionsPrepared.where || {};
        optionsPrepared.where[field] = id;

        return this.getOne(optionsPrepared);
    }

    getOne(options)
    {
        let optionsPrepared = this.prepareOptions(options);
        let cacheKey;

        // Prepare cache key for read from cache
        cacheKey = this.cacheKey(`${this.cachePrefix()}.get`, optionsPrepared);

        // Check if need read from cache
        return this.cacheRead(cacheKey, optionsPrepared).then(cached => {
            // Check if model is cached
            if (cached) return cached;

            return this.connection.findOne(optionsPrepared).then(model => {
                // Check if model not need population
                if (!model || optionsPrepared.lazy) {
                    return model;
                }

                // If no lazy model, populate necesary data
                return this.populate(model, _.omit(optionsPrepared, OMIT_OPTIONS));
            })
            .then(model => {
                // Save model in cache if necesary
                return this.cacheWrite(cacheKey, model, optionsPrepared);
            });
        });
    }

    getOneRand(options)
    {
        let optionsPrepared = this.prepareOptions(options);

        // Prepare order condition
        optionsPrepared.order = optionsPrepared.order || [];
        optionsPrepared.order.push([sequelize.fn('RAND')])

        return this.getOne(optionsPrepared);
    }

    count(options)
    {
        let optionsPrepared = this.prepareOptions(options);

        optionsPrepared.lazy = optionsPrepared.lazy != void 0 ? optionsPrepared.lazy : true;

        return P.bind(this).then(() => {
            // Prepare options for optimizate query only selection IDs
            if (optionsPrepared.lazy) {
                optionsPrepared.attributes = optionsPrepared.attributes || [];
                optionsPrepared.attributes.push(DEFAULT_FIELD_ID);
            }

            return this.connection.count(optionsPrepared);
        });
    }

    exists(options)
    {
        return this.count(options).then(count => (count || 0) > 0);
    }

    create(data, options)
    {
        return this.connection.create(data, this.prepareWriteOptions(options));
    }

    batchCreate(data, options)
    {
        return this.transaction(transaction => {
            return this.batchCreateWithoutTransaction(data, _.extend({}, options || {}, {
                transaction
            }));
        });
    }

    batchCreateWithoutTransaction(data, options)
    {
        return new P((resolve, reject) => {
            async.map(data, (data, next) => {
                this.create(data.data, _.extend({}, options, data.options || {})).then(model => {
                    next(null, model);
                })
                .catch(next);
            }, (error, models) => {
                if (error) return reject(error);
                return resolve(models);
            });
        });
    }

    update(data, id, field, options)
    {
        // Prepare arguments
        if (_.isObject(field)) {
            options = field;
            field = DEFAULT_FIELD_ID;
        }
        if (!_.isString(field)) {
            field = DEFAULT_FIELD_ID;
        }

        let optionsPrepared = this.prepareWriteOptions(options);

        // Prepare where condition
        optionsPrepared.where = optionsPrepared.where || {};
        optionsPrepared.where[field] = id;

        return this.connection.update(data, optionsPrepared);
    }

    batchUpdate(data, field, options)
    {
        // Prepare arguments
        if (_.isObject(field)) {
            options = field;
            field = DEFAULT_FIELD_ID;
        }
        if (!_.isString(field)) {
            field = DEFAULT_FIELD_ID;
        }

        return this.transaction(transaction => {
            return this.batchUpdateWithoutTransaction(data, field,  _.extend({}, options || {}, {
                transaction
            }));
        });
    }

    batchUpdateWithoutTransaction(data, field, options)
    {
        // Prepare arguments
        if (_.isObject(field)) {
            options = field;
            field = DEFAULT_FIELD_ID;
        }
        if (!_.isString(field)) {
            field = DEFAULT_FIELD_ID;
        }

        return new P((resolve, reject) => {
            async.map(data, (data, next) => {
                this.update(data.data, data.id, field, _.extend({}, options, data.options || {})).then(result => {
                    next(null, result);
                })
                .catch(next);
            }, (error, results) => {
                if (error) return reject(error);
                return resolve(results);
            });
        });
    }

    destroy(id, field, options)
    {
        // Prepare arguments
        if (_.isObject(field)) {
            options = field;
            field = DEFAULT_FIELD_ID;
        }
        if (!_.isString(field)) {
            field = DEFAULT_FIELD_ID;
        }

        let optionsPrepared = this.prepareWriteOptions(options);

        // Prepare where condition
        optionsPrepared.where = optionsPrepared.where || {};
        optionsPrepared.where[field] = id;

        return this.connection.destroy(optionsPrepared);
    }

    batchDestroy(ids, field, options)
    {
        // Prepare arguments
        if (_.isObject(field)) {
            options = field;
            field = DEFAULT_FIELD_ID;
        }
        if (!_.isString(field)) {
            field = DEFAULT_FIELD_ID;
        }

        return this.transaction(transaction => {
            return this.batchDestroyWithoutTransaction(ids, field, _.extend({}, options || {}, {
                transaction
            }));
        });
    }

    batchDestroyWithoutTransaction(ids, field, options)
    {
        // Prepare arguments
        if (_.isObject(field)) {
            options = field;
            field = DEFAULT_FIELD_ID;
        }
        if (!_.isString(field)) {
            field = DEFAULT_FIELD_ID;
        }

        return new P((resolve, reject) => {
            async.map(ids, (id, next) => {
                this.destroy(id, field, options).then(result => {
                    next(null, result);
                })
                .catch(next);
            }, (error, results) => {
                if (error) return reject(error);
                return resolve(results);
            });
        });
    }

    store(query, options)
    {
        return this.connection.query(query, options);
    }

    query(query, options)
    {
        let optionsPrepared = options || {};

        optionsPrepared.type = optionsPrepared.type || sequelize.QueryTypes.SELECT;

        return this.rawConnection.query(query, optionsPrepared);
    }

    queryOne(query, options)
    {
        return this.query(query, options).then(results => {
            return _.first(results || []);
        });
    }

    transaction(callback)
    {
        return this.rawConnection.transaction(callback);
    }

    populate(model)
    {
        return P.resolve(model);
    }

    prepareOptions(options)
    {
        return _.defaults({}, options || {}, DEFAULT_READ_OPTIONS);
    }

    prepareWriteOptions(options)
    {
        return _.defaults({}, options || {}, DEFAULT_WRITE_OPTIONS);
    }

    mapping(models, field, args, options)
    {
        if (_.isEmpty(models)) {
            return models;
        }

        if (_.isObject(args)) {
            options = args;
            args = [];
        }

        options = options || {};
        args = args || [];

        return new P((resolve, reject) => {
            async.map(models, (model, next) => {
                this.getById.apply(this, [model[field]].concat(args).concat([options])).then(model => {
                    next(null, model);
                });
            }, (error, models) => {
                if (error) return reject(error);
                return resolve(models);
            });
        });
    }
}

Object.defineProperty(BaseModel.prototype, 'models', {
    get: function() {
        if (Models) {
            return Models;
        }
        return Models = require('../../models');
    },
    enumerable: false,
    configurable: false
});

module.exports = BaseModel;
