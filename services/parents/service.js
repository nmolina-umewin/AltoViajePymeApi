'use strict';

const _         = require('lodash');
const P         = require('bluebird');
const request   = require('request-promise');
const Utilities = require('../../utilities');

const METHODS        = ['get', 'post', 'put', 'delete', 'patch', 'head'];
const DEFAULT_METHOD = 'get';

class Service
{
    constructor(options) {
        this.r = request.defaults(options || {});
    }

    request(method, options)
    {
        return this.r(this.prepareOptions(method, options));
    }

    prepareOptions(method, options)
    {
        if (_.isString(options)) {
            options = {
                uri: options
            };
        }
        options.method = method || DEFAULT_METHOD;
        return options;
    }
}

_.each(METHODS, method => {
    Service.prototype[method] = function(options) {
        return this.request(method, options);
    };
});

module.exports = Service;
