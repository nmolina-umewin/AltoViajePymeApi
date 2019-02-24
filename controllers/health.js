"use strict";

const pkg = require('../package.json');
const Utilities = require('../utilities');

function handle(req, res, next) 
{
    Utilities.Database.query('SHOW TABLES', function (error, results, fields) {
        var data = [];

        results.forEach(function(element) {
            data.push(element.Tables_in_av_pyme);
        });

        res.send({
            description: pkg.description,
            environment: process.env.NODE_ENV || 'production',
            version: pkg.version,
            tables: data
        });
    });
}

module.exports = handle;
