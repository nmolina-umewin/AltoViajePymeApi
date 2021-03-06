"use strict";

const _ = require('lodash');
const Base = require('./parents/model');

const MODEL_NAME = 'companyStatus';

const STATUSES = {
    PENDING  : 1,
    VERIFIED : 2
};

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }
}

_.each(STATUSES, (status, key) => {
    Object.defineProperty(Model.prototype, key, {
        get: () => status,
        enumerable: true,
        configurable: false
    });
});

module.exports = new Model;
