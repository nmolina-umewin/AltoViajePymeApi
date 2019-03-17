'use strict';

const _         = require('lodash');
const P         = require('bluebird');
const async     = require('async');
const Config    = require('../../utilities/config');
const BaseModel = require('./model');

const OMIT_OPTIONS     = Config('Database.Options.OmitOptions', ['attributes', 'where', 'order', 'group', 'limit', 'offset']);
const DEFAULT_FIELD_ID = Config('Database.Options.DefaultFieldId', 'id');

class BaseModelAttributable extends BaseModel
{
    constructor(model)
    {
        super(model);
    }

    createWithAttributes(data, attributes, options)
    {
        return this.transaction(transaction => {
            let optionsPrepared = _.extend({}, options || {}, {
                transaction
            });

            return this.createWithAttributesWithoutTransaction(data, attributes, optionsPrepared);
        });
    }

    batchCreateWithAttributes(data, options)
    {
        return this.transaction(transaction => {
            let optionsPrepared = _.extend({}, options || {}, {
                transaction
            });

            return new P((resolve, reject) => {
                async.map(data, (data, next) => {
                    this.createWithAttributesWithoutTransaction(data.data, data.attributes, _.extend({}, optionsPrepared, data.options || {})).then(model => {
                        next(null, model);
                    });
                }, (error, models) => {
                    if (error) return reject(error);
                    return resolve(models);
                });
            });
        });
    }

    createWithAttributesWithoutTransaction(data, attributes, options)
    {
        let optionsPrepared = this.prepareOptions(options);

        return P.bind(this)
            .then(() => {
                return super.create(data, optionsPrepared);
            })
            .then(model => {
                if (_.isFunction(model.get)) {
                    model = model.get({
                        plain: true
                    });
                }

                if (model.id) {
                    return this.createOrUpdateAttributes(this.name, model, attributes, optionsPrepared).then(attributes => {
                        model.attributes = attributes;
                        return model;
                    });
                }
                return model;
            });
    }

    updateWithAttributes(data, id, attributes, options)
    {
        return this.transaction(transaction => {
            let optionsPrepared = _.extend({}, options || {}, {
                transaction
            });

            return this.updateWithAttributesWithoutTransaction(data, id, attributes, optionsPrepared);
        });
    }

    batchUpdateWithAttributes(data, options)
    {
        return this.transaction(transaction => {
            let optionsPrepared = _.extend({}, options || {}, {
                transaction
            });

            return new P((resolve, reject) => {
                async.map(data, (data, next) => {
                    this.updateWithAttributesWithoutTransaction(data.data, data.id, data.attributes, _.extend({}, optionsPrepared, data.options || {})).then(result => {
                        next(null, result);
                    });
                }, (error, results) => {
                    if (error) return reject(error);
                    return resolve(results);
                });
            });
        });
    }

    updateWithAttributesWithoutTransaction(data, id, attributes, options)
    {
        let optionsPrepared = this.prepareOptions(options);

        return P.bind(this)
            .then(() => {
                return super.update(data, id, optionsPrepared);
            })
            .then(() => {
                return this.getById(id, _.extend({
                    useMaster: true,
                    force: true
                }, optionsPrepared));
            })
            .then(model => {
                if (_.isFunction(model.get)) {
                    model = model.get({
                        plain: true
                    });
                }

                if (model.id) {
                    return this.createOrUpdateAttributes(this.name, model, attributes, optionsPrepared).then(attributes => {
                        model.attributes = attributes;
                        return model;
                    });
                }
                return model;
            });
    }

    createOrUpdateAttributes(entity, model, attributes, options)
    {
        return P.bind(this)
            .then(() => {
                return this.models.Attributes.getAll();
            })
            .then(models => {
                return new P((resolve, reject) => {
                    async.map(attributes, (attribute, next) => {
                        let model;

                        if (attribute.name) {
                            model = _.find(models, ['description', attribute.name]);

                            if (model) {
                                attribute.idAttribute = model.id;
                            }
                        }
                        else if (attribute.id) {
                            model = _.find(models, ['id', attribute.id]);

                            if (model) {
                                attribute.name = model.description;
                                attribute.idAttribute = attribute.id;
                                delete attribute.id;
                            }
                        }
                        next(null, attribute);
                    }, (error, attributes) => {
                        if (error) return reject(error);
                        return resolve(attributes);
                    });
                });
            })
            .then(attributes => {
                let entityUnderscored = _.snakeCase(entity);

                return P.map(attributes, attribute => {
                    let modelAttribute = this.models[`${_.upperFirst(entity)}Attributes`];
                    let optionsGet = {
                        where: {
                            [`id_${entityUnderscored}`]: model.id,
                            id_attribute: attribute.idAttribute
                        }
                    };

                    return modelAttribute.getOne(optionsGet).then(attributeValue => {
                        let data = {
                            description: attribute.value
                        };

                        if (attributeValue) {
                            return modelAttribute.update(data, attributeValue.id, options).then(() => {
                                attributeValue.value = data.value;
                                return attributeValue;
                            });
                        }

                        data[`id_${entityUnderscored}`] = model.id;
                        data.id_attribute = attribute.idAttribute;

                        return modelAttribute.create(data, options);
                    })
                    .then(model => {
                        if (_.isFunction(model.get)) {
                            model = model.get({
                                plain: true
                            });
                        }

                        model.name = attribute.name;
                        return model;
                    });
                });
            });
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

    getAllAttributes(options)
    {
        let attributes = this.models[`${this.name}Attribute`];
        let optionsPrepared = this.prepareOptions(options);
        let cacheKey;

        // Prepare cache key for read from cache
        cacheKey = this.cacheKey(`${attributes.cachePrefix()}.getAll.populated`, optionsPrepared);

        // Check if need read from cache
        return this.cacheRead(cacheKey, optionsPrepared).then(cached => {
            // Check if models are cached
            if (cached) return cached;

            return attributes.getAll(optionsPrepared).then(models => {
                // Check if model not need population
                if (!models || !models.length || optionsPrepared.lazy) {
                    return models;
                }

                // If no lazy models, load attributes
                return new P((resolve, reject) => {
                    async.map(models, (model, next) => {
                        this.getAttributeById(model.id, optionsPrepared).then(model => {
                            next(null, model);
                        });
                    }, (error, models) => {
                        if (error) return reject(error);
                        resolve(models);
                    });
                });
            })
            .then(models => {
                // Save models in cache if necesary
                return this.cacheWrite(cacheKey, models, optionsPrepared);
            });
        });
    }

    getAttributeById(id, options)
    {
        let attributes = this.models[`${this.name}Attribute`];
        let optionsPrepared = this.prepareOptions(options);
        let cacheKey;

        // Prepare cache key for read from cache
        cacheKey = this.cacheKey(`${attributes.cachePrefix()}.get.id:${id}.field:${DEFAULT_FIELD_ID}.populated`, optionsPrepared);

        // Check if need read from cache
        return this.cacheRead(cacheKey, optionsPrepared).then(cached => {
            // Check if models are cached
            if (cached) return cached;

            return attributes.getById(id, optionsPrepared).then(model => {
                if (!model) return model;

                return this.populateField(model.id, this.name).then(field => {
                    model.field = field;
                    return _.omit(model, 'id_attribute_type', 'description');
                });
            })
            .then(model => {
                // Save models in cache if necesary
                return this.cacheWrite(cacheKey, model, optionsPrepared);
            });
        });
    }

    populate(model, options)
    {
        let optionsPrepared = _.omit(options, OMIT_OPTIONS);

        return super.populate(model, optionsPrepared).then(model => {
            return this.populateAttributes(model, this.name, optionsPrepared);
        });
    }

    populateAttributes(model, entity)
    {
        return this.models.Attributes.getByEntity(entity, model.id).then(attributes => {
            model.attributes = attributes;
            return model;
        });
    }
}

module.exports = BaseModelAttributable;
