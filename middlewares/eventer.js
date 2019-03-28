"use strict";

const Utilities = require('../utilities');

function handle(req, res, next)
{
    req.context = req.context || {};
    req.context.eventer = new Utilities.Eventer(req.get('x-av-event-token'));
    req.context.eventer.start().then(() => {
        next();
    });
}

module.exports = handle;
