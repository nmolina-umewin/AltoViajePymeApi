"use strict";

const _ = require('lodash');
const Base = require('./parents/model');

const MODEL_NAME = 'administratorPermission';

const PERMISSIONS = {
    SUPER_ADMIN : 1,
    ADMIN       : 2,
    ASSISTANT   : 3
};

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getAll(options)
    {
        let optionsPrepared = this.prepareOptions(options);

        // Prepare order condition
        optionsPrepared.order = optionsPrepared.order || [];
        optionsPrepared.order.push(['id']);

        return super.getAll(optionsPrepared);
    }
}

_.each(PERMISSIONS, (permission, key) => {
    Object.defineProperty(Model.prototype, key, {
        get: () => permission,
        enumerable: true,
        configurable: false
    });
});

module.exports = new Model;
