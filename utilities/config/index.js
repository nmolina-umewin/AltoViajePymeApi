"use strict";

const _ = require('lodash');

const CONFIG = {
    Cache    : require('./cache'),
    Server   : require('./server'),
    Database : require('./database'),
    Service  : require('./service')
};

function Config(key, defaultValue)
{
    return _.get(CONFIG, key, defaultValue);
}

Config.Raw = CONFIG;

_.extend(Config, CONFIG);

module.exports = Config;
