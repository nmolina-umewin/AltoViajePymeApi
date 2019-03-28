"use strict";

const pkg = require('../package.json');
const Utilities = require('../utilities');

function handle(req, res, next) 
{
    Utilities.Database.isAlive().then(alive => response(null, alive)).catch(response);

    function response(error, alive)
    {
        let database = error ? { error } : {
            alive: alive ? true : false
        };

        res.send({
            description: pkg.description,
            environment: process.env.NODE_ENV || 'production',
            version: pkg.version,
            database
        });
    }
}


module.exports = handle;
