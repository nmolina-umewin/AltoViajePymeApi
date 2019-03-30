"use strict";

const _ = require('lodash');
const Models = require('../../../../models');

const OPERATORS_NAMES = {
    [Models.Operators.RAPIPAGO]      : 'rapipago',
    [Models.Operators.BITEX]         : 'bitex',
    [Models.Operators.WIRE_TRANSFER] : 'wireTransfer'
};

let Operators = {};

_.each(OPERATORS_NAMES, (operator, id) => {
    Object.defineProperty(Operators, id, {
        get: () => require(`./${operator}`),
        enumerable: true,
        configurable: false
    });
});

module.exports = Operators;
