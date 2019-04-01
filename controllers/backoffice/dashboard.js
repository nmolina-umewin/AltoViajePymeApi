"use strict";

const P         = require('bluebird');
const Models    = require('../../models');
const Utilities = require('../../utilities');
const Errors    = Utilities.Errors;
const Log       = Utilities.Log;

const SETTING_GUARANTEE_LIMIT = 1;

function handle(req, res) 
{
    return Utilities.Functions.CatchError(res,
        P.bind(this)
            .then(() => {
                return getData();
            })
            .then(models => {
                res.send(models);
            })
    );
}

function getData()
{
    let data = {};

    return P.resolve()
        .then(() => {
            return getPoints(data);
        })
        .then(() => {
            return getPendings(data);
        })
        .then(() => {
            return getLimits(data);
        })
        .then(() => {
            return getBalance(data);
        })
        .then(() => {
            return data;
        });
}

function getPoints(data)
{
    return P.resolve()
        .then(() => {
            // Puntos Disponibles​: La suma de las wallets de las empresas
            return Models.Companies.getAllAvailablePoints().then(total => {
                data.companies = data.companies || {};
                data.companies.availablePoints = total || 0;
                return data;
            });
        });
}

function getPendings(data)
{
    return P.resolve()
        .then(() => {
            // Pendientes de Pago​: La suma de las cargas exitosas a SUBE que todavía AltoViaje no le pagó a SUBE.
            return Models.RechargeTransactions.getAllPendingPayments().then(total => {
                data.recharges = data.recharges || {};
                data.recharges.pendingPayments = total || 0;
                return data;
            });
        });
}

function getLimits(data)
{
    return P.resolve()
        .then(() => {
            // Límite de Garantía​: Es simplemente el valor de una configuración que veremos más adelante en este documento.
            return Models.Settings.getById(SETTING_GUARANTEE_LIMIT).then(setting => {
                data.limits = data.limits || {};
                data.limits.guarantee = Number(setting.description);
                return data;
            });
        });
}

function getBalance(data)
{
    return P.resolve()
        .then(() => {
            // Saldo para Operar​: Límite de Garantía - Pendientes de Pago
            data.balance = data.limits.guarantee - data.recharges.pendingPayments;
            return data;
        });
}

module.exports = handle;
