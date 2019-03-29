"use strict";

// App Modules
// =========================
const Config = require('./utilities/config');
const Functions = require('./utilities/functions');
const Controllers = require('./controllers');
const Middlewares = require('./middlewares');

// Express Application
// =========================
const app = Functions.App;

// Routes
// =========================
app.get(    '/config',                                Controllers.Config);
app.get(    '/health',                                Controllers.Health);

app.post(   '/administrators/login',                  Controllers.Auth.Administrators.Login);
app.post(   '/administrators/reset',                  Controllers.Auth.Administrators.Reset);
app.get(    '/administrators/reset/:token',           Controllers.Auth.Administrators.ResetByToken);
app.post(   '/administrators/forgot',                 Controllers.Auth.Administrators.ForgotPassword);
app.get(    '/administrators/permissions',            Controllers.Administrators.Permissions.All);
app.get(    '/administrators',                        Controllers.Administrators.List);
app.post(   '/administrators',                        Controllers.Administrators.Create);
app.put(    '/administrators/:id',                    Controllers.Administrators.Update);
app.get(    '/administrators/:id',                    Controllers.Administrators.ById);
app.delete( '/administrators/:id',                    Controllers.Administrators.Delete);

app.get(    '/permissions',                           Controllers.Permissions.All);
app.post(   '/login',                                 Middlewares.Eventer, Controllers.Auth.Login);
// app.post(   '/register',                              Middlewares.Eventer, Controllers.Auth.Register);
app.post(   '/reset',                                 Middlewares.Eventer, Controllers.Auth.Reset);
app.get(    '/reset/:token',                          Controllers.Auth.ResetByToken);
app.post(   '/forgot',                                Middlewares.Eventer, Controllers.Auth.ForgotPassword);
app.post(   '/users',                                 Middlewares.Eventer, Controllers.Users.Create);
app.put(    '/users/:id',                             Middlewares.Eventer, Controllers.Users.Update);
app.get(    '/users/:id',                             Controllers.Users.ById);
app.delete( '/users/:id',                             Middlewares.Eventer, Controllers.Users.Delete);
app.post(   '/users/delete/batch',                    Middlewares.Eventer, Controllers.Users.DeleteBatch);

app.post(   '/groups',                                Middlewares.Eventer, Controllers.Groups.Create);
app.get(    '/groups/:id',                            Middlewares.Eventer, Controllers.Groups.ById);
app.post(   '/persons',                               Middlewares.Eventer, Controllers.Persons.Create);
app.put(    '/persons/:id',                           Middlewares.Eventer, Controllers.Persons.Update);
app.get(    '/persons/:id',                           Controllers.Persons.ById);
app.delete( '/persons/:id',                           Middlewares.Eventer, Controllers.Persons.Delete);
app.post(   '/persons/delete/batch',                  Middlewares.Eventer, Controllers.Persons.DeleteBatch);

// app.post(   '/points/buy',                            Middlewares.Eventer, Controllers.Points.Buy);

app.post(   '/recharges',                             Middlewares.Eventer, Controllers.Recharges.Recharge);
app.get(    '/recharges/:id',                         Controllers.Recharges.ById);

app.post(   '/companies',                             Controllers.Companies.Create);
app.get(    '/companies',                             Controllers.Companies.List);
app.put(    '/companies/:id',                         Controllers.Companies.Update);
app.get(    '/companies/:id',                         Controllers.Companies.ById);
app.delete( '/companies/:id',                         Controllers.Companies.Delete);
app.get(    '/companies/:id/users',                   Controllers.Companies.Users.All);
app.get(    '/companies/:id/groups',                  Controllers.Companies.Groups.All);
app.get(    '/companies/:id/persons',                 Controllers.Companies.Persons.All);
app.get(    '/companies/:id/persons/groups/:idGroup', Controllers.Companies.Persons.Groups.All);
app.get(    '/companies/:id/recharges',               Controllers.Companies.Recharges.All);
app.get(    '/companies/:id/recharges/last',          Controllers.Companies.Recharges.Last);
app.get(    '/companies/:id/operations',              Controllers.Companies.Operations.All);
app.get(    '/companies/:id/operations/last',         Controllers.Companies.Operations.Last);
app.get(    '/companies/:id/operations/pending',      Controllers.Companies.Operations.Pendings);
app.post(   '/companies/:id/wallets',                 Controllers.Companies.Wallets.Charge);

app.get(    '/operations/operators',                  Controllers.Operations.Operators);

app.get(    '/settings',                              Controllers.Settings.ByKey);
app.put(    '/settings/:id',                          Controllers.Settings.Update);


// Start Server!
// =========================
if (process.env.NODE_ENV !== 'testing') {
    app.listen(Config('Server.Port'), () => console.log(Config('Server.Message')));
}

module.exports = app;
