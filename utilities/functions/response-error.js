"use strict";

const Log = require('../logger');

function response(error, callback) 
{
    Log.Error(error.message);
    return callback(error, null); 
}

module.exports = response;
