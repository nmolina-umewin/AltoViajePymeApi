"use strict";

const _ = require('lodash');
const Base = require('./parents/model');

const MODEL_NAME = 'rechargeTransactionStatus';

const STATUSES = {
    INCOMPLETE : 1,
    DONE       : 2,
    FAIL       : 3
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
