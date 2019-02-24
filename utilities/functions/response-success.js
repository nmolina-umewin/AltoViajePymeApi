"use strict";

function response(result, callback)
{
    return callback(null, result); 
}

module.exports = response;
