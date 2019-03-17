'use strict';

const _      = require('lodash');
const P      = require('bluebird');
const Time   = require('../time');
const Config = require('../config');
const redis  = require('redis');

P.promisifyAll(redis.RedisClient.prototype);
P.promisifyAll(redis.Multi.prototype);

const TYPES = {
    milliseconds: 'MILLISECOND',
    seconds: 'SECOND',
    minutes: 'MINUTE',
    hours: 'HOUR',
    days: 'DAY',
    months: 'MONTH',
    years: 'YEAR'
};

class Cache {

    get type() {
        return TYPES;
    }

    constructor() {
        this.isEnabled = Config('Cache.Enabled', false);

        if (this.isEnabled) {
            this.client = redis.createClient(_.defaults({}, Config('Cache.Options', {})));
        }
    }

    configure(options) {
        if (this.isEnabled) {
            _.extend(this.client.options, options || {});
        }
    }

    get(key, defaultValue) {
        if (!this.isEnabled) {
            return P.resolve();
        }

        return this.client.getAsync(key).then(value => {
            if (!_.isNil(value)) {
                return JSON.parse(value);
            }
            return defaultValue;
        });
    }

    put(key, value, time = 1, type = TYPES.days) {
        if (!this.isEnabled) {
            return P.resolve(value);
        }

        if (!_.isObject(key)) {
            if (_.isNil(value)) {
                return this.remove(key);
            }
            else {
                key = {
                    [key]: value
                };
            }
        }

        if (_.isString(time)) {
            type = time;
            time = value;
        }

        let [expirationTime, expirationType] = this.prepareExpirationTime(time, type);
        let p = P.bind(this);

        _.each(key, (v, k) => {
            p = p.then(() => {
                return this.client.setAsync(k, JSON.stringify(v), expirationType, expirationTime);
            });
        });
        return p.then(() => {
            return value;
        });
    }

    remove(keys) {
        if (!this.isEnabled) {
            return P.resolve();
        }

        keys = _.isArray(keys) ? keys : [keys];

        return this.client.delAsync(keys).then(() => {
            this.client.flushdb();
            return keys;
        });
    }

    removeMatch(pattern) {
        if (!this.isEnabled) {
            return P.resolve();
        }

        return this.client.keysAsync(pattern).then(keys => {
            if (!keys || !keys.length) {
                return keys;
            }
            return this.remove(keys);
        });
    }

    end(flush) {
        if (!this.isEnabled) {
            return P.resolve();
        }

        return new P((resolve, reject) => {
            try {
                this.client.end(flush);
            }
            catch(e) {
                reject(e);
            }
        });
    }

    quit() {
        if (!this.isEnabled) {
            return P.resolve();
        }

        return new P((resolve, reject) => {
            try {
                this.client.quit(resolve);
            }
            catch(e) {
                reject(e);
            }
        });
    }

    prepareKey(key) {
        return key.toLowerCase();
    }

    prepareExpirationTime(time, type) {
        if (type !== TYPES.milliseconds) {
            time = time * Time[type.toUpperCase()];
        }
        return [time, 'PX'];
    }

}

module.exports = Cache;
