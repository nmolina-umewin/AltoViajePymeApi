"use strict";

const _         = require('lodash');
const Base      = require('./parents/service');
const Config    = require('../utilities/config');
const Utilities = require('../utilities');
const Errors    = Utilities.Errors;

const OPTIONS = Config('Service.Afip');

class Service extends Base
{
    constructor()
    {
        super(OPTIONS);
    }

    getCompany(cuit, options)
    {
        return this.get(_.merge({
            uri: '/GetContribuyente',
            qs: {
                cuit
            }
        }, options))
        .then(res => {
            if (res.errorGetData || !res.Contribuyente) {
                throw new Errors.NotFound(res.errorMessage || 'The number of C.U.I.T. entered is not valid');
            }
            return this.parseCompany(res.Contribuyente);
        });
    }

    parseCompany(company)
    {
        return {
            legal_address : company.domicilioFiscal.direccion,
            cuit          : company.idPersona,
            name          : company.nombre
        };
    }
}

module.exports = new Service;
