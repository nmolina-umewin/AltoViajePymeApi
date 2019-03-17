'use strict';

const _         = require('lodash');
const P         = require('bluebird');
const Utilities = require('../../utilities');
const Cache     = Utilities.Cache;
const Log       = Utilities.Log;

class BaseModelCacheable
{
    cacheRead(key, options)
    {
        let p = P.bind(this);

        // Check if need read from cache
        if (options && !options.force && options.cache) {
            p = p.then(() => {
                return Cache.get(key);
            });
        }
        return p;
    }

    cacheWrite(key, result, options)
    {
        if (options && !options.cache) {
            return P.resolve(result);
        }
        if (!result || (_.isArray(result) && !result.length)) {
            return P.resolve(result);
        }
        return Cache.put(key, result).catch(this.cacheThrow).then(() => {
            return result;
        });
    }

    cacheKey(key, options)
    {
        key = Cache.prepareKey(key, options);

        if (!options) {
            return key;
        }

        if (options.attributes) {
            let attributes = _.reduce(options.attributes, (memo, value) => {
                memo.push(`${JSON.stringify(value)}`);
                return memo;
            }, []).join('.');

            key = `${key}.attributes[${attributes}]`;
        }
        if (options.where) {
            let where = _.reduce(_.keys(options.where), (memo, key) => {
                memo.push(`${key}:${JSON.stringify(options.where[key])}`);
                return memo;
            }, []).join('.');

            key = `${key}.where[${where}]`;
        }
        if (options.order) {
            let order = _.reduce(options.order, (memo, value) => {
                memo.push(`${JSON.stringify(value)}`);
                return memo;
            }, []).join('.');

            key = `${key}.order[${order}]`;
        }
        if (options.group) {
            let group = _.reduce(options.group, (memo, value) => {
                memo.push(`${JSON.stringify(value)}`);
                return memo;
            }, []).join('.');

            key = `${key}.group[${group}]`;
        }
        if (options.limit) {
            key = `${key}.limit[${options.limit}]`;
        }
        if (options.offset) {
            key = `${key}.offset[${options.offset}]`;
        }
        return key;
    }

    cacheClean(suffix)
    {
        return Cache.removeMatch(`*${this.cachePrefix()}*${suffix || ''}`).catch(this.cacheThrow);
    }

    cachePrefix()
    {
        return this.connection.name;
    }

    cacheThrow(e)
    {
        Log.Warning(e);
    }
}

module.exports = BaseModelCacheable;
