"use strict";

const _ = require('lodash');
const Base = require('./parents/model');

const MODEL_NAME = 'rechargeTransactionSituation';

const SITUATIONS = {
    NEED_PAID  : 1,
    IN_PROCESS : 2,
    PAID_OUT   : 3
};

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }
}

_.each(SITUATIONS, (situation, key) => {
    Object.defineProperty(Model.prototype, key, {
        get: () => situation,
        enumerable: true,
        configurable: false
    });
});

module.exports = new Model;
