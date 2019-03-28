"use strict";

const _ = require('lodash');

function validate(value)
{
    if (!_.isString(value) || value.length !== 11) {
        return false;
    }

    let digits = value.split('');
    let digit  = Number(digits.pop());
    let sum    = 0;
    let verif;
    let i, l;

    for(i = 0, l = digits.length; i < l; i++) {
        sum += digits[9 - i] * (2 + (i % 6));
    }

    verif = 11 - (sum % 11);
    verif = verif === 11 ? 0 : verif === 10 ? 9 : verif;
    return digit === verif;
}

module.exports = validate;
