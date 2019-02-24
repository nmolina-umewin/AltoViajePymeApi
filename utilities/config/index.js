"use strict";

const _ = require('lodash');

const CONFIG = {
    Server : require('./server'),
    Database : require('./database')
};

function Config(key, defaultValue)
{
    return _.get(CONFIG, key, defaultValue);
}

Config.Raw = CONFIG;

_.extend(Config, CONFIG);

module.exports = Config;
