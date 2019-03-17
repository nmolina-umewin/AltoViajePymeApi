"use strict";

const os = require('os');
const pkg = require('./package.json');

const APP_MAIN = pkg.main;
const APP_NAME = pkg.name;

module.exports = {
    apps : [{
        name: APP_NAME,
        script: APP_MAIN,
        cwd: `/root/altoviaje/${APP_NAME}`,
        instances: os.cpus().length,
        exec_mode: 'cluster',
        out_file: `/root/altoviaje/logs/${APP_NAME}.log`,
        error_file: `/root/altoviaje/logs/${APP_NAME}.error.log`,
        env: {
            NODE_ENV: 'development',
            LOG_ERROR_STACK: 1,
            watch: 'true',
            ignore_watch: ['node_modules', 'tests']
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }]
};
