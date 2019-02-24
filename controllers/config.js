"use strict";

const Config = require('../utilities/config');

function handle(req, res)
{
    res.send(Config.Raw);
}

module.exports = handle;
