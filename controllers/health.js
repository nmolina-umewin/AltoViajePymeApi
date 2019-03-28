"use strict";

const _         = require('lodash');
const P         = require('bluebird');
const pkg       = require('../package.json');
const Utilities = require('../utilities');
const Services  = require('../services');

function handle(req, res, next) 
{
    let context = {
        description: pkg.description,
        environment: process.env.NODE_ENV || 'production',
        version: pkg.version
    };

    return P.resolve()
        .then(() => {
            return getDatabase(context);
        })
        .then(() => {
            return getServices(context);
        })
        .then(() => {
            return res.send(context);
        });
}

function getDatabase(context)
{
    return Utilities.Database.isAlive().then(alive => {
        context.database = {
            alive: alive ? true : false
        };
        return P.resolve(context);
    })
    .catch(error => {
        context.database = {
            alive: false,
            error
        };
        return P.resolve(context);
    });
}

function getServices(context)
{
    context.services = {};

    return P.resolve()
        .then(() => {
            let p = P.resolve();

            _.each(Services, (Service, name) => {
                if (name === 'Afip') {
                    return;
                }

                p = p.then(() => {
                    return Service.get('/health').then(res => {
                        context.services[name] = {
                            alive: !!res.version
                        };
                        return P.resolve(context);
                    });
                })
                .catch(error => {
                    context.services[name] = {
                        alive: false,
                        error
                    };
                    return P.resolve(context);
                });
            });
            return p;
        });
}

module.exports = handle;
