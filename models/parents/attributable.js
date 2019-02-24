"use strict";

const P = require('bluebird');
const Base = require('./model');

class Model extends Base
{

    populate(model) {
        return P.bind(this)
            .then(() => {
                return this.models.Attributes.getByEntity(this.name, model.id).then(attributes => {
                    model.attributes = attributes;
                    return model;
                });
            });
    }

}

module.exports = Model;
