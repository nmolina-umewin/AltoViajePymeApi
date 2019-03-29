"use strict";

const _      = require('lodash');
const Base   = require('./parents/model');
const Config = require('../utilities/config');

const OMIT_OPTIONS     = Config('Database.Options.OmitOptions', ['attributes', 'where', 'order', 'group', 'limit', 'offset']);
const DEFAULT_FIELD_ID = Config('Database.Options.DefaultFieldId', 'id');
const MODEL_NAME       = 'setting';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getByKey(key, options)
    {
        return this.query(this.queries.Settings.byKey(key), options).then(models => {
            return this.mapping(models, DEFAULT_FIELD_ID, _.omit(options, OMIT_OPTIONS));
        });
    }
}

module.exports = new Model;
