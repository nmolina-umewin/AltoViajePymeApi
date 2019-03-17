"use strict";

const Base = require('./parents/model');

const MODEL_NAME = 'userPermission';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getByUser(idUser, options)
    {
        let optionsPrepared = this.prepareOptions(options);

        // Prepare where condition
        optionsPrepared.where = optionsPrepared.where || {};
        optionsPrepared.where.id_user = idUser;

        return this.getOne(optionsPrepared);
    }
}

module.exports = new Model;
