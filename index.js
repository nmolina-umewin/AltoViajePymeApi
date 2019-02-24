"use strict";

// App Modules
// =========================
const Config = require('./utilities/config');
const Functions = require('./utilities/functions');
const Controllers = require('./controllers');

// Express Application
// =========================
const app = Functions.App;

// Routes
// =========================
app.get( '/config',                Controllers.Config);
app.get( '/health',                Controllers.Health);
app.get( '/permissions',           Controllers.Permissions.All);
app.post('/login',                 Controllers.Auth.Login);
app.post('/users',                 Controllers.Users.Create);
app.put( '/users/:id',             Controllers.Users.Update);
app.get( '/users/:id',             Controllers.Users.ById);
app.get( '/companies/:id',         Controllers.Companies.ById);
app.get( '/companies/:id/users',   Controllers.Companies.Users.All);


// Start Server!
// =========================
if (process.env.NODE_ENV !== 'testing') {
    app.listen(Config('Server.Port'), () => console.log(Config('Server.Message')));
}

module.exports = app;