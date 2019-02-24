"use strict";

const P = require('bluebird');
const Base = require('./parents/model');
const async = require('async');
const Utilities = require('../utilities');
const Database  = Utilities.Database;

const Queries = Database.Queries.Attributes;

const MODEL_NAME = 'attribute';

class Model extends Base
{
    constructor() {
        super(MODEL_NAME);
    }

    getByEntity(entity, id) {
        return this.query(Queries.byEntity(entity, id)).then(models => {
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
                    resolve(models);
                });
            });
        });
    }

    populate(model, options) {
        options = options || {};

        return P.bind(this)
            .then(() => {
                model.value = model.description;
                model.field = {
                    name: model.name,
                    type: model.type
                };

                if (options.entity) {
                    delete model[`id_${options.entity}`];
                    
                }
                delete model.id_attribute;
                delete model.description;
                delete model.created_at;
                delete model.updated_at;
                delete model.name;
                delete model.type;

                return model;
            });
    }
}

module.exports = new Model;
