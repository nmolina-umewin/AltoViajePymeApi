"use strict";

const _ = require('lodash');
const P = require('bluebird');
const async = require('async');
const Utilities = require('../../utilities');
const Database  = Utilities.Database;

const Queries = Database.Queries.Models;

let Models;

class Model
{
    constructor(name, table) {
        this.name = name;
        this.table = table || `${name}s`;
    }

    query(query, options) {
        return new P((resolve, reject) => {
            return Database.query(query, (error, models) => {
                if (error) return reject(error);
                resolve(models);
            });
        });
    }

    queryOne(query, options) {
        return new P((resolve, reject) => {
            return Database.queryOne(query, (error, model) => {
                if (error) return reject(error);
                resolve(model);
            });
        });
    }

    getAll(id, options) {
        let queries = Database.Queries[this.table];
        let query   = queries && queries.all || Queries.all(this.table, id, options);

        if (_.isFunction(query)) {
            query = query(options);
        }

        return this.query(query, options).then(models => {
            return this.mapping(models, options);
        });
    }

    getById(id, options) {
        let queries = Database.Queries[this.table];
        let query   = queries && queries.byId || Queries.byId(this.table, id, options);

        if (_.isFunction(query)) {
            query = query(id, options);
        }

        return this.queryOne(query, options).then(model => {
            return P.resolve(this.populate(model, options));
        });
    }

    create(data, options) {
        let queries = Database.Queries[this.table];
        let query   = queries && queries.create || Queries.create(this.table, data, options);

        if (_.isFunction(query)) {
            query = query(data, options);
        }

        return this.query(query, options).then(result => {
            return this.getById(result.insertId, options);
        });
    }

    update(id, data, options) {
        let queries = Database.Queries[this.table];
        let query   = queries && queries.create || Queries.create(this.table, id, data, options);

        if (_.isFunction(query)) {
            query = query(id, data, options);
        }

        return this.query(query, options).then(result => {
            return this.getById(id, options);
        });
    }

    remove(id, options) {
        let queries = Database.Queries[this.table];
        let query   = queries && queries.remove || Queries.remove(this.table, id, options);

        if (_.isFunction(query)) {
            query = remove(id, options);
        }

        return this.query(query, options).then(result => {
            console.log(result);
            return true;
        });
    }

    populate(model) {
        return model;
    }

    mapping(models, options) {
        return new P((resolve, reject) => {
            async.map(models, (model, next) => {
                return this.getById(model.id, options)
                    .then(model => {
                        next(null, model);
                    })
                    .catch(next);
            }, (error, models) => {
                if (error) return reject(error);
                resolve(models);
            });
        });
    }
}

Object.defineProperty(Model.prototype, 'models', {
    get: () => {
        if (Models) {
            return Models;
        }
        return Models = require('../../models');
    },
    enumerable: false,
    configurable: false
});

module.exports = Model;
