"use strict";

const _      = require('lodash');
const Base   = require('./parents/service');
const Config = require('../utilities/config');

const OPTIONS     = Config('Service.Events');
const APPLICATION = 3;

class Service extends Base
{
    constructor()
    {
        super(OPTIONS);
    }

    getToken(options)
    {
        return this.get(_.extend({
            uri: `/token`
        }, options));
    }

    emit(event, options)
    {
        return this.post(_.extend({
            uri: `/transactions`,
            body: _.defaultsDeep({
                id_application      : APPLICATION,
                id_transaction_type : event
            }, options)
        }, options));
    }
}

module.exports = new Service;
