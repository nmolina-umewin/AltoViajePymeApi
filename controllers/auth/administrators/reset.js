"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const md5       = require('md5');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

function handle(req, res) 
{
    let context = _.clone(req.body);

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getAdministrator(context);
            })
            .then(() => {
                return reset(context);
            })
            .then(() => {
                return getAdministrator(context);
            })
            .then(model => {
                res.send(model);
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context.idAdministrator)) {
            Log.Error('Bad request invalid id administrator.');
            return reject(new Errors.BadRequest('Bad request invalid id administrator.'));
        }
        else if (_.isEmpty(context.password)) {
            Log.Error('Bad request invalid password.');
            return reject(new Errors.BadRequest('Bad request invalid password.'));
        }
        return resolve(context);
    });
}

function getAdministrator(context) 
{
    return Models.Administrators.getById(context.idAdministrator).then(administrator => {
        if (!administrator) {
            Log.Error(`Administrator ${context.idAdministrator} not found.`);
            return P.reject(Errors.NotExists.Administrator);
        }
        context.administrator = administrator;
        return administrator;
    });
}

function reset(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                active : 1
            };
            let attributes = [{
                name  : 'password',
                value : md5(context.password)
            }];

            return Models.Administrators.updateWithAttributes(data, context.administrator.id, attributes);
        })
        .then(() => {
            Models.Administrators.cacheClean();
            return context;
        });
}

module.exports = handle;
