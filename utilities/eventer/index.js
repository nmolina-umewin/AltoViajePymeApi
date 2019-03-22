"use strict";

const P      = require('bluebird');
const Log    = require('../logger');
const Events = require('../../services/events');

class Eventer
{
    start()
    {
        return P.bind(this)
            .then(() => {
                return Events.getToken().then(res => {
                    this.token = res.token;
                    return this;
                });
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
                        P.resolve(console.log(event, JSON.stringify(data)));
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
