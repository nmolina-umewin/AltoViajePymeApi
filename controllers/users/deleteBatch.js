"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

const EVENT_CONTEXT_PROPERTIES = ['ids'];
const EVENT_TRANSACTION        = 30013;

function handle(req, res) 
{
    let context = _.extend({}, req.context || {}, {
        ids: req.body && req.body.ids || null
    });

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return update(context);
            })
            .then(() => {
                // Emit event user update success
                return context.eventer.emit(EVENT_TRANSACTION, _.extend(_.pick(context, EVENT_CONTEXT_PROPERTIES)))
                .catch(Log.Error)
                .then(() => {
                    // Send response to client
                    return res.status(Utilities.Http.Status.NO_CONTENT).send();
                });
            })
    );
}

function validate(context)
{
    return new P((resolve, reject) => {
        if (_.isEmpty(context)) {
            Log.Error('Bad request user not found.');
            return reject(new Errors.BadRequest('Bad request user not found.'));
        }
        else if (_.isEmpty(context.ids) || !_.every(context.ids, Utilities.Validator.isInt)) {
            Log.Error('Bad request ids user not found.');
            return reject(new Errors.BadRequest('Bad request ids user not found.'));
        }
        return resolve(context);
    });
}

function update(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                active: 0,
                deleted_at: new Date()
            };

            return Models.Users.update(data, {
                $in: context.ids
            });
        })
        .then(() => {
            Models.Companies.cacheClean();
            Models.Users.cacheClean();
            return P.resolve();
        });
}

module.exports = handle;
