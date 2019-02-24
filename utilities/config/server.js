"use strict";

const pkg = require('../../package.json');
const PORT = 8003;

module.exports = {
	Port : PORT,
	Message : `Application ${pkg.description} Deployed in PORT ${PORT}!`
};
