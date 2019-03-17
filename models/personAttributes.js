"use strict";

const Base = require('./parents/model');

const MODEL_NAME = 'personAttribute';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }
}

module.exports = new Model;
