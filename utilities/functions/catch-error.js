"use strict";

const Log = require('../logger');
const Errors = require('../errors');
const Status = require('../http/status');

const DEFAULT_ERROR_MESSAGE = 'Internal Server Error';
const DEFAULT_ERROR_STATUS = Status.INTERNAL_SERVER_ERROR;

function handle(res, promise) 
{
    promise.catch(Errors.CustomError, error => {
            res.status(error.code || DEFAULT_ERROR_STATUS).send(error.toJson());
        })
        .catch(error => {
            Log.Error(`${DEFAULT_ERROR_MESSAGE}. ${error} ${process.env.LOG_ERROR_STACK ? error.stack || '' : ''}`);
            res.status(DEFAULT_ERROR_STATUS).send(Errors.Internal.toJson());
        });
}


module.exports = handle;
