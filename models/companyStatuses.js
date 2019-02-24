"use strict";

const Base = require('./parents/model');

const MODEL_NAME = 'company_status';
const MODEL_TABLE = 'company_statuses';

class Model extends Base
{
    constructor() {
        super(MODEL_NAME, MODEL_TABLE);
    }
}

module.exports = new Model;
