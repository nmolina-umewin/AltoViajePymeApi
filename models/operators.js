"use strict";

const _ = require('lodash');
const Base = require('./parents/model');

const MODEL_NAME = 'operator';

const OPERATORS = {
    RAPIPAGO      : 1,
    WIRE_TRANSFER : 2,
    BITEX         : 3
};

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }
}

_.each(OPERATORS, (operator, key) => {
    Object.defineProperty(Model.prototype, key, {
        get: () => operator,
        enumerable: true,
        configurable: false
    });
});

module.exports = new Model;
