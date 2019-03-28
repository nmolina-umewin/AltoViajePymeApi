"use strict";

const P      = require('bluebird');
const Log    = require('../logger');
const Events = require('../../services/events');
const moment = require('moment');
const colors = require('colors');

class Eventer
{
    constructor(token)
    {
        this.token = token;
    }

    start()
    {
        if (this.token) {
            return P.resolve(this);
        }
        return P.bind(this)
            .then(() => {
                return Events.getToken().then(res => {
                    this.token = res.token;
                    return this;
                });
            })
            .catch(error => {
                console.error(`${'EVENTLOG'.green} - ${moment()} - ${'EVENT'.yellow}: ERROR - ${'DATA'.yellow}: ${error}`);
                return P.resolve(this);
            });
    }

    emit(event, options)
    {
        return P.bind(this)
            .then(() => {
                setImmediate(() => {
                    this.emitSync(event, options);
                });
                return P.resolve(this);
            });
    }

    emitSync(event, options)
    {
        return P.bind(this)
            .then(() => {
                if (!this.token) {
                    return this.start();
                }
                return this;
            })
            .then(() => {
                let data = {
                    token       : this.token,
                    description : options
                };

                return P.bind(this)
                    .then(() => {
                        console.log(`${'EVENTLOG'.green} - ${moment()} - ${'EVENT'.yellow}: ${event} - ${'DATA'.yellow}: ${JSON.stringify(data)}`);
                        return P.resolve(this);
                    })
                    .catch(Log.Error)
                    .then(() => {
                        return Events.emit(event, data);
                    });
            })
            .catch(Log.Error);
    }
}

module.exports = Eventer;
