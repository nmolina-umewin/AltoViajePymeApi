"use strict";

const _ = require('lodash');

function CustomError(message, extra) 
{
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.extra = extra;
}

CustomError.prototype.toJson = function toJson() 
{
    let json = {
        error: this.message
    };

    if (_.isObject(this.extra) && this.extra.code) {
        json.code = this.extra.code;
    }
    return json;
};

module.exports = CustomError;

require('util').inherits(module.exports, Error);
