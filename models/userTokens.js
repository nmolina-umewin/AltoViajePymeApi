"use strict";

const Base = require('./parents/model');

const MODEL_NAME = 'userToken';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getByToken(token, options)
    {
        return this.queryOne(this.queries.UserTokens.byToken(token), options).then(model => {
            if (!model) {
                return P.resolve();
            }
            return this.populate(model, options);
        });
    }
}

module.exports = new Model;
