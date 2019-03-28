"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const validator = require('validator');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = _.extend({}, req.body, {
        idConfiguration: req.params && req.params.id || null
    });

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return verify(context);
            })
            .then(() => {
                return update(context);
            })
            .then(model => {
                res.send(model);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context)) {
            Log.Error('Bad request invalid configuration information.');
            return reject(new Errors.BadRequest('Bad request invalid configuration information.'));
        }
        else if (!Utilities.Validator.isInt(context.idConfiguration)) {
            Log.Error('Bad request invalid id configuration.');
            return reject(new Errors.BadRequest('Bad request invalid id configuration.'));
        }
        else if (_.isNil(context.value)) {
            Log.Error('Bad request invalid value.');
            return reject(new Errors.BadRequest('Bad request invalid value.'));
        }
        return resolve(context);
    });
}

function verify(context) 
{
    return P.resolve()
        .then(() => {
            return getConfiguration(context);
        });
}

function getConfiguration(context) 
{
    return Models.Configurations.getById(context.idConfiguration).then(configuration => {
        if (!configuration) {
            Log.Error(`Configuration ${context.idConfiguration} not found.`);
            return P.reject(Errors.NotExists.Configuration);
        }
        context.configuration = configuration;
        return context;
    });
}

function update(context) 
{
    return P.resolve()
        .then(() => {
            return save(context);
        })
        .then(() => {
            return Models.Configurations.getById(context.configuration.id, {
                useMaster: true,
                force: true
            });
        });
}

function save(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                description: context.value
            };

            return Models.Configurations.update(data, context.configuration.id);
        })
        .then(model => {
            Models.Configurations.cacheClean();
            return model;
        });
}

module.exports = handle;
