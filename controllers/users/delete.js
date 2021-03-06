"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

const EVENT_CONTEXT_PROPERTIES = ['idUser'];
const EVENT_TRANSACTION        = 30013;

function handle(req, res) 
{
    let context = _.extend({}, req.context || {}, {
        idUser: req.params && req.params.id || null
    });

    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return validate(context);
            })
            .then(() => {
                return getUser(context);
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
            Log.Error('Bad request invalid user.');
            return reject(new Errors.BadRequest('Bad request invalid user.'));
        }
        else if (!Utilities.Validator.isInt(context.idUser)) {
            Log.Error('Bad request invalid id user.');
            return reject(new Errors.BadRequest('Bad request invalid id user.'));
        }
        return resolve(context);
    });
}

function getUser(context) 
{
    return Models.Users.getById(context.idUser).then(user => {
        if (!user) {
            Log.Error(`User ${context.idUser} not found.`);
            return P.reject(Errors.NotExists.User);
        }
        context.user = user;
        return context;
    });
}

function update(context) 
{
    return P.resolve()
        .then(() => {
            let data = {
                active     : 0,
                deleted_at : new Date()
            };

            return Models.Users.update(data, context.user.id);
        })
        .then(() => {
            Models.Companies.cacheClean();
            Models.Users.cacheClean(context.user.id);
            return context;
        });
}

module.exports = handle;
