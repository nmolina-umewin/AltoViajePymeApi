"use strict";

const Base = require('./parents/model');

const MODEL_NAME = 'personCard';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getByPerson(idPerson, options)
    {
        let optionsPrepared = this.prepareOptions(options);

        // Prepare where condition
        optionsPrepared.where = optionsPrepared.where || {};
        optionsPrepared.where.id_person = idPerson;
        optionsPrepared.where.deleted_at = {
            $is: null
        };

        return this.getAll(optionsPrepared);
    }

    populate(model)
    {
        delete model.id_person;
        return super.populate(model);
    }
}

module.exports = new Model;
