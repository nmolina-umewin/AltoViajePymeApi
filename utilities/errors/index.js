"use strict";

const CustomError = require('./custom');
const Status      = require('../http/status');

class InternalServerError extends CustomError
{
    constructor(message, extra)
    {
        super(message, Status.INTERNAL_SERVER_ERROR, extra);
    }
}

class ConflictError extends CustomError
{
    constructor(message, extra)
    {
        super(message, Status.CONFLICT, extra);
    }
}

class Unauthorized extends CustomError
{
    constructor(message, extra)
    {
        super(message, Status.UNAUTHORIZED, extra);
    }
}

class BadRequest extends CustomError
{
    constructor(message, extra)
    {
        super(message, Status.BAD_REQUEST, extra);
    }
}

class NotFound extends CustomError
{
    constructor(message, extra)
    {
        super(message, Status.NOT_FOUND, extra);
    }
}

module.exports = {
    Internal                          : new InternalServerError('Internal Server Error.'),
    CannotExecuteQuery                : new InternalServerError('The system cannot execute the query.'),
    NotExists : {
        Token                         : new NotFound('The given token doesn\'t exist.'),
        User                          : new NotFound('The given user doesn\'t exist.'),
        Users                         : new NotFound('The given users doesn\'t exist.'),
        Group                         : new NotFound('The given group doesn\'t exist.'),
        Groups                        : new NotFound('The given groups doesn\'t exist.'),
        Person                        : new NotFound('The given person doesn\'t exist.'),
        Persons                       : new NotFound('The given persons doesn\'t exist.'),
        Permission                    : new NotFound('The given permission doesn\'t exist.'),
        Permissions                   : new NotFound('The given permissions doesn\'t exist.'),
        Operator                      : new NotFound('The given operator doesn\'t exist.'),
        Operators                     : new NotFound('The given operators doesn\'t exist.'),
        PaymentTransaction            : new NotFound('The given payment transaction doesn\'t exist.'),
        PaymentTransactions           : new NotFound('The given payment transactions doesn\'t exist.'),
        PaymentTransactionStatus      : new NotFound('The given payment transaction status doesn\'t exist.'),
        PaymentTransactionStatuses    : new NotFound('The given payment transaction statuses doesn\'t exist.'),
        Company                       : new NotFound('The given company doesn\'t exist.'),
        Companies                     : new NotFound('The given companies doesn\'t exist.'),
        RechargeTransaction           : new NotFound('The given recharge transaction doesn\'t exist.'),
        RechargeTransactions          : new NotFound('The given recharge transactions doesn\'t exist.'),
        RechargeTransactionSituation  : new NotFound('The given recharge transaction situation doesn\'t exist.'),
        RechargeTransactionSituations : new NotFound('The given recharge transaction situations doesn\'t exist.'),
        Administrator                 : new NotFound('The given administrator doesn\'t exist.'),
        Administrators                : new NotFound('The given administrators doesn\'t exist.'),
        AdministratorPermission       : new NotFound('The given administrator permission doesn\'t exist.'),
        AdministratorPermissions      : new NotFound('The given administrator permissions doesn\'t exist.'),
    },
    Format     : {
        Token                         : new BadRequest('The given token is not well-formed'),
        JSON                          : new BadRequest('The given JSON is not well-formed')
    },
    InternalServerError,
    ConflictError,
    Unauthorized,
    BadRequest,
    NotFound,
    CustomError
};
