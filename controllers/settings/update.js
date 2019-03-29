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
        idSetting: req.params && req.params.id || null
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
            Log.Error('Bad request invalid setting information.');
            return reject(new Errors.BadRequest('Bad request invalid setting information.'));
        }
        else if (!Utilities.Validator.isInt(context.idSetting)) {
            Log.Error('Bad request invalid id setting.');
            return reject(new Errors.BadRequest('Bad request invalid id setting.'));
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
            return getSetting(context);
        });
}

function getSetting(context) 
{
    return Models.Settings.getById(context.idSetting).then(setting => {
        if (!setting) {
            Log.Error(`Setting ${context.idSetting} not found.`);
            return P.reject(Errors.NotExists.Setting);
        }
        context.setting = setting;
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
            return Models.Settings.getById(context.setting.id, {
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

            return Models.Settings.update(data, context.setting.id);
        })
        .then(model => {
            Models.Settings.cacheClean();
            return model;
        });
}

module.exports = handle;
