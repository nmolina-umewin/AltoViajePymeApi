"use strict";

const _    = require('lodash');
const P    = require('bluebird');
const Base = require('./parents/model');

const MODEL_NAME = 'companyWallet';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    charge(id, points, options)
    {
        return this.transaction(transaction => {
            let optionsPrepared = _.extend({}, options || {}, {
                transaction
            });

            return P.bind(this)
                .then(() => {
                    return this.getById(id, _.extend({}, optionsPrepared || {}, {
                        useMaster: true,
                        force: true
                    }));
                })
                .then(model => {
                    let data = {
                        points: model.points + points
                    };

                    return super.update(data, id, optionsPrepared).then(() => {
                        model.points = data.points;
                        return model;
                    });
                })
                .then(model => {
                    let data = {
                        id_administrator: options.idAdministrator,
                        id_backoffice_transaction_type: this.models.BackofficeTransactionTypes.COMPANIES_WALLETS_CHARGE,
                        description: JSON.stringify({
                            id_company        : options.idCompany,
                            id_company_wallet : id,
                            current_points    : model.points - points,
                            points            : points
                        })
                    };
                    
                    return this.models.BackofficeTransactions.create(data, optionsPrepared).then(() => {
                        return model;
                    });
                });
        });
    }
}

module.exports = new Model;
