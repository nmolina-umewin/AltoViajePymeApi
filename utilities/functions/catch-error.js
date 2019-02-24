"use strict";

const Log = require('../logger');
const Errors = require('../errors');

const DEFAULT_ERROR_MESSAGE = 'Internal Server Error';
const DEFAULT_ERROR_STATUS = 500;

function handle(res, promise) 
{
    promise.catch(Errors.CustomError, error => {
            res.status(error.extra && error.extra.code || DEFAULT_ERROR_STATUS).send(error.toJson());
        })
        .catch(error => {
            Log.Error(`${DEFAULT_ERROR_MESSAGE}. ${error}`);
            res.status(DEFAULT_ERROR_STATUS).send(Errors.Internal.toJson());
        });
}


module.exports = handle;
