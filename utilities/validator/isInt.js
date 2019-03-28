"use strict";

const _         = require('lodash');
const validator = require('validator');

function validate(value)
{
    if (_.isInteger(value)) {
        return true;
    }
    return !_.isEmpty(value) && validator.isInt(value);
}

module.exports = validate;
