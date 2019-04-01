"use strict";

const _ = require('lodash');
const Base = require('./parents/model');

const MODEL_NAME = 'rechargePaymentOrderStatus';

const STATUSES = {
    PENDING  : 1,
    PAID_OUT : 2,
    CANCELED : 3
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
