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
app.get(    '/config',                                     Controllers.Config);
app.get(    '/health',                                     Controllers.Health);

app.post(   '/administrators/login',                       Controllers.Auth.Administrators.Login);
app.post(   '/administrators/reset',                       Controllers.Auth.Administrators.Reset);
app.get(    '/administrators/reset/:token',                Controllers.Auth.Administrators.ResetByToken);
app.post(   '/administrators/forgot',                      Controllers.Auth.Administrators.ForgotPassword);
app.get(    '/administrators/permissions',                 Controllers.Administrators.Permissions.List);
app.get(    '/administrators',                             Controllers.Administrators.List);
app.post(   '/administrators',                             Controllers.Administrators.Create);
app.put(    '/administrators/:id',                         Controllers.Administrators.Update);
app.get(    '/administrators/:id',                         Controllers.Administrators.ById);
app.delete( '/administrators/:id',                         Controllers.Administrators.Delete);

app.get(    '/permissions',                                Controllers.Permissions.List);
app.post(   '/login',                                      Middlewares.Eventer, Controllers.Auth.Login);
// app.post(   '/register',                                   Middlewares.Eventer, Controllers.Auth.Register);
app.post(   '/reset',                                      Middlewares.Eventer, Controllers.Auth.Reset);
app.get(    '/reset/:token',                               Controllers.Auth.ResetByToken);
app.post(   '/forgot',                                     Middlewares.Eventer, Controllers.Auth.ForgotPassword);
app.post(   '/users',                                      Middlewares.Eventer, Controllers.Users.Create);
app.put(    '/users/:id',                                  Middlewares.Eventer, Controllers.Users.Update);
app.get(    '/users/:id',                                  Controllers.Users.ById);
app.delete( '/users/:id',                                  Middlewares.Eventer, Controllers.Users.Delete);
app.post(   '/users/delete/batch',                         Middlewares.Eventer, Controllers.Users.DeleteBatch);

app.post(   '/groups',                                     Middlewares.Eventer, Controllers.Groups.Create);
app.get(    '/groups/:id',                                 Controllers.Groups.ById);
app.post(   '/persons',                                    Middlewares.Eventer, Controllers.Persons.Create);
app.put(    '/persons/:id',                                Middlewares.Eventer, Controllers.Persons.Update);
app.get(    '/persons/:id',                                Controllers.Persons.ById);
app.delete( '/persons/:id',                                Middlewares.Eventer, Controllers.Persons.Delete);
app.post(   '/persons/delete/batch',                       Middlewares.Eventer, Controllers.Persons.DeleteBatch);

app.post(   '/payments',                                   Middlewares.Eventer, Controllers.Payments.Payment);
app.get(    '/payments/operators',                         Controllers.Payments.Operators);

app.post(   '/recharges',                                  Middlewares.Eventer, Controllers.Recharges.Recharge);
app.post(   '/recharges/payments/orders',                  Controllers.Recharges.Payments.Create);
app.get(    '/recharges/payments/orders',                  Controllers.Recharges.Payments.List);
app.get(    '/recharges/payments/orders/:id',              Controllers.Recharges.Payments.ById);
app.put(    '/recharges/payments/orders/:id',              Controllers.Recharges.Payments.Status);

app.get(    '/transactions/payments',                      Controllers.Transactions.Payments.List);
app.get(    '/transactions/payments/:id',                  Controllers.Transactions.Payments.ById);
app.put(    '/transactions/payments/:id',                  Controllers.Transactions.Payments.Status);
app.get(    '/transactions/recharges',                     Controllers.Transactions.Recharges.List);
app.get(    '/transactions/recharges/:id',                 Controllers.Transactions.Recharges.ById);
app.put(    '/transactions/recharges/:id',                 Controllers.Transactions.Recharges.Status);

app.get(    '/companies',                                  Controllers.Companies.List);
app.post(   '/companies',                                  Controllers.Companies.Create);
app.put(    '/companies/:id',                              Controllers.Companies.Update);
app.get(    '/companies/:id',                              Controllers.Companies.ById);
app.delete( '/companies/:id',                              Controllers.Companies.Delete);
app.get(    '/companies/:id/users',                        Controllers.Companies.Users.List);
app.get(    '/companies/:id/groups',                       Controllers.Companies.Groups.List);
app.get(    '/companies/:id/persons',                      Controllers.Companies.Persons.List);
app.get(    '/companies/:id/persons/groups/:idGroup',      Controllers.Companies.Persons.Groups.List);
app.get(    '/companies/:id/transactions/payments',        Controllers.Companies.Transactions.Payments.List);
app.get(    '/companies/:id/transactions/recharges',       Controllers.Companies.Transactions.Recharges.List);
app.post(   '/companies/:id/wallets',                      Controllers.Companies.Wallets.Charge);

app.get(    '/settings',                                   Controllers.Settings.ByKey);
app.put(    '/settings/:id',                               Controllers.Settings.Update);

app.get(    '/backoffice/dashboard',                       Controllers.Backoffice.Dashboard);


// Start Server!
// =========================
if (process.env.NODE_ENV !== 'testing') {
    app.listen(Config('Server.Port'), () => console.log(Config('Server.Message')));
}

module.exports = app;
