"use strict";

const _ = require('lodash');
const Base = require('./parents/model');
const Config = require('../utilities/config');

const OMIT_OPTIONS     = Config('Database.Options.OmitOptions', ['attributes', 'where', 'order', 'group', 'limit', 'offset']);
const DEFAULT_FIELD_ID = Config('Database.Options.DefaultFieldId', 'id');
const MODEL_NAME = 'personGroup';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getByPerson(idPerson, options)
    {
        return this.query(this.queries.PersonGroups.byPerson(idPerson), options).then(models => {
            let optionsPrepared = _.defaultsDeep({
                withoutCompany: true
            }, _.omit(options, OMIT_OPTIONS));

            return this.models.Groups.mapping(models, DEFAULT_FIELD_ID, optionsPrepared);
        });
    }
}

module.exports = new Model;
