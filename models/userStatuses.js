"use strict";

const Base = require('./parents/model');

const MODEL_NAME = 'user_status';
const MODEL_TABLE = 'user_statuses';

class Model extends Base
{
    constructor() {
        super(MODEL_NAME, MODEL_TABLE);
    }
}

module.exports = new Model;
