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
app.get(    '/config',                                Controllers.Config);
app.get(    '/health',                                Controllers.Health);
app.get(    '/permissions',                           Controllers.Permissions.All);
app.post(   '/login',                                 Controllers.Auth.Login);
app.post(   '/reset',                                 Controllers.Auth.Reset);
app.get(    '/reset/:token',                          Controllers.Auth.ResetByToken);
app.post(   '/forgot',                                Controllers.Auth.ForgotPassword);
app.post(   '/users',                                 Controllers.Users.Create);
app.put(    '/users/:id',                             Controllers.Users.Update);
app.get(    '/users/:id',                             Controllers.Users.ById);
app.delete( '/users/:id',                             Controllers.Users.Delete);
app.post(   '/users/delete/batch',                    Controllers.Users.DeleteBatch);
app.post(   '/groups',                                Controllers.Groups.Create);
app.get(    '/groups/:id',                            Controllers.Groups.ById);
app.post(   '/points/buy',                            Controllers.Points.Buy);
app.post(   '/persons',                               Controllers.Persons.Create);
app.put(    '/persons/:id',                           Controllers.Persons.Update);
app.get(    '/persons/:id',                           Controllers.Persons.ById);
app.delete( '/persons/:id',                           Controllers.Persons.Delete);
app.post(   '/persons/delete/batch',                  Controllers.Persons.DeleteBatch);
app.post(   '/recharges',                             Controllers.Recharges.Recharge);
app.post(   '/recharges/:id/repeat',                  Controllers.Recharges.RechargeRepeat);
app.get(    '/companies/:id',                         Controllers.Companies.ById);
app.get(    '/companies/:id/users',                   Controllers.Companies.Users.All);
app.get(    '/companies/:id/groups',                  Controllers.Companies.Groups.All);
app.get(    '/companies/:id/persons',                 Controllers.Companies.Persons.All);
app.get(    '/companies/:id/persons/groups/:idGroup', Controllers.Companies.Persons.Groups.All);
app.get(    '/companies/:id/recharges',               Controllers.Companies.Recharges.All);
app.get(    '/companies/:id/recharges/last',          Controllers.Companies.Recharges.Last);
app.get(    '/operations/operators',                  Controllers.Operations.Operators);
app.get(    '/configurations',                        Controllers.Configurations.ByKey);


// Start Server!
// =========================
if (process.env.NODE_ENV !== 'testing') {
    app.listen(Config('Server.Port'), () => console.log(Config('Server.Message')));
}

module.exports = app;
