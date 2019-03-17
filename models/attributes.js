"use strict";

const P     = require('bluebird');
const Base  = require('./parents/model');
const async = require('async');

const MODEL_NAME = 'attribute';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getAllRaw()
    {
        return this.query(this.queries.Attributes.byEntity(entity, id)).then(models => {
            return new P((resolve, reject) => {
                async.map(models, (model, next) => {
                    return P.bind(this)
                        .then(() => {
                            return this.populate(model, {
                                entity
                            });
                        })
                        .then(model => {
                            next(null, model);
                        })
                        .catch(next);
                }, (error, models) => {
                    if (error) return reject(error);
                    return resolve(models);
                });
            });
        });
    }

    getByEntity(entity, id)
    {
        return this.query(this.queries.Attributes.byEntity(entity, id)).then(models => {
            return new P((resolve, reject) => {
                async.map(models, (model, next) => {
                    return P.bind(this)
                        .then(() => {
                            model.value = model.description;
                            model.field = {
                                name: model.name,
                                type: model.type
                            };

                            delete model[`id_${entity}`];
                            delete model.id_attribute;
                            delete model.description;
                            delete model.created_at;
                            delete model.updated_at;
                            delete model.name;
                            delete model.type;

                            next(null, model);
                        })
                        .catch(next);
                }, (error, models) => {
                    if (error) return reject(error);
                    return resolve(models);
                });
            });
        });
    }
}

module.exports = new Model;
