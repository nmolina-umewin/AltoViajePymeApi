"use strict";

// Node Modules
// =========================
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
      app.use(morgan('dev'));
      app.enable('trust proxy');
      app.disable('x-powered-by');
      app.use(cors());
      app.options('*', cors());
      app.use(compression());
      app.use(cookieParser());
      app.use(bodyParser.raw());
      app.use(bodyParser.text());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({
          extended: true
      }));

module.exports = app;
