"use strict";

function callback(response, error, result) 
{
    if (error) {
        response.status(404).json({ message : error.message });
    }
    else {
        response.json(result);
    }
}

module.exports = callback;
