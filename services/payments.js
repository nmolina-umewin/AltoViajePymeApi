"use strict";

const Base   = require('./parents/service');
const Config = require('../utilities/config');

const OPTIONS = Config('Service.Payments');

class Service extends Base
{
    constructor()
    {
        super(OPTIONS);
    }

    payment(idOperator, options)
    {
        return this.post({
            uri: `/services/${idOperator}/payment`,
            body: options
        });
    }
}

module.exports = new Service;
