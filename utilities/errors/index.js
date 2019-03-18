"use strict";

const CustomError = require('./custom');
const Status      = require('../http/status');

class InternalServerError extends CustomError
{
    constructor(message, extra)
    {
        super(message);
        this.extra = extra;
    }
}

class Unauthorized extends CustomError
{
    constructor(message, extra)
    {
        super(message, Status.UNAUTHORIZED);
        this.extra = extra;
    }
}

class BadRequest extends CustomError
{
    constructor(message, extra)
    {
        super(message, Status.BAD_REQUEST);
        this.extra = extra;
    }
}

class NotFound extends CustomError
{
    constructor(message, extra)
    {
        super(message, Status.NOT_FOUND);
        this.extra = extra;
    }
}

module.exports = {
    Internal                 : new InternalServerError('Internal Server Error.'),
    CannotExecuteQuery       : new InternalServerError('The system cannot execute the query.'),
    NotExists : {
        Token                : new NotFound('The given token doesn\'t exist.'),
        User                 : new NotFound('The given user doesn\'t exist.'),
        Users                : new NotFound('The given users doesn\'t exist.'),
        Group                : new NotFound('The given group doesn\'t exist.'),
        Groups               : new NotFound('The given groups doesn\'t exist.'),
        Person               : new NotFound('The given person doesn\'t exist.'),
        Persons              : new NotFound('The given persons doesn\'t exist.'),
        Permission           : new NotFound('The given permission doesn\'t exist.'),
        Permissions          : new NotFound('The given permissions doesn\'t exist.'),
        Company              : new NotFound('The given company doesn\'t exist.'),
        Companies            : new NotFound('The given companies doesn\'t exist.'),
        RechargeTransaction  : new NotFound('The given recharge transaction doesn\'t exist.'),
        RechargeTransactions : new NotFound('The given recharge transactions doesn\'t exist.')
    },
    Format     : {
        Token                : new BadRequest('The given token is not well-formed'),
        JSON                 : new BadRequest('The given JSON is not well-formed')
    },
    InternalServerError,
    Unauthorized,
    BadRequest,
    NotFound,
    CustomError
};
