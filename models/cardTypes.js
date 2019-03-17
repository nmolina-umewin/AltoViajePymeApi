"use strict";

const _ = require('lodash');
const Base = require('./parents/model');

const MODEL_NAME = 'cardType';

const TYPES = {
    SUBE : 1
};

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }
}

_.each(TYPES, (status, key) => {
    Object.defineProperty(Model.prototype, key, {
        get: () => status,
        enumerable: true,
        configurable: false
    });
});

module.exports = new Model;
