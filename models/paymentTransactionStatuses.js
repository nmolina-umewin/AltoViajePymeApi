"use strict";

const _ = require('lodash');
const Base = require('./parents/model');

const MODEL_NAME = 'paymentTransactionStatus';

const STATUSES = {
    PENDING  : 1,
    REJECTED : 2,
    APPROVED : 3,
    EXPIRED  : 4
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
