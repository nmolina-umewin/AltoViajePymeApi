"use strict";

const _ = require('lodash');
const Base = require('./parents/model');

const MODEL_NAME = 'backofficeTransactionType';

const TYPES = {
    COMPANIES_WALLETS_CHARGE : 1
};

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }
}

_.each(TYPES, (type, key) => {
    Object.defineProperty(Model.prototype, key, {
        get: () => type,
        enumerable: true,
        configurable: false
    });
});

module.exports = new Model;
