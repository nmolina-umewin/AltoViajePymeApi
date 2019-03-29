"use strict";

const _      = require('lodash');
const P      = require('bluebird');
const Base   = require('./parents/model');

const MODEL_NAME = 'backofficeTransaction';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    populate(model, options)
    {
        options = options || {};

        return P.bind(this)
            .then(() => {
                return super.populate(model);
            })
            .then(() => {
                return this.models.BackofficeTransactionTypes.getById(model.id_backoffice_transaction_type).then(type => {
                    model.type = type;
                    delete model.id_backoffice_transaction_type;
                    return model;
                });
            });
    }
}

module.exports = new Model;
