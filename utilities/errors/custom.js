"use strict";

const _      = require('lodash');
const Status = require('../http/status');

class CustomError extends Error
{
    constructor(message, code = Status.INTERNAL_SERVER_ERROR)
    {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }

    toJson() 
    {
        let json = {
            error : this.message,
            code  : this.code
        };

        if (this.extra) {
            json.extra = this.extra;
        }
        return json;
    }
}

module.exports = CustomError;
