"use strict";

const _      = require('lodash');
const P      = require('bluebird');
const async  = require('async');
const Base   = require('./parents/attributable');
const Config = require('../utilities/config');

const OMIT_OPTIONS     = Config('Database.Options.OmitOptions', ['attributes', 'where', 'order', 'group', 'limit', 'offset']);
const DEFAULT_FIELD_ID = Config('Database.Options.DefaultFieldId', 'id');
const MODEL_NAME       = 'person';

class Model extends Base
{
    constructor()
    {
        super(MODEL_NAME);
    }

    getAll(idBenefit, options)
    {
        return this.query(this.queries.Persons.all(), options).then(models => {
            return this.mapping(models, DEFAULT_FIELD_ID, _.omit(options, OMIT_OPTIONS));
        });
    }

    getByCompany(idCompany, options)
    {
        return this.query(this.queries.Persons.byCompany(idCompany), options).then(models => {
            return this.mapping(models, DEFAULT_FIELD_ID, _.omit(options, OMIT_OPTIONS));
        });
    }

    getByCompanyAndGroup(idCompany, idGroup, options)
    {
        return this.query(this.queries.Persons.byCompanyAndGroup(idCompany, idGroup), options).then(models => {
            return this.mapping(models, DEFAULT_FIELD_ID, _.omit(options, OMIT_OPTIONS));
        });
    }

    getByIds(ids, options)
    {
        return this.query(this.queries.Persons.byIds(ids), options).then(models => {
            return this.mapping(models, DEFAULT_FIELD_ID, _.omit(options, OMIT_OPTIONS));
        });
    }

    createWithAttributesWithoutTransaction(data, attributes, options)
    {
        options = options || {};

        return P.bind(this)
            .then(() => {
                return super.createWithAttributesWithoutTransaction(data, attributes, options);
            })
            .then(model => {
                if (!options.groups) {
                    return model;
                }

                return new P((resolve, reject) => {
                    async.each(options.groups, (group, next) => {
                        let data = {
                            id_person : model.id,
                            id_group  : group.id
                        };

                        return this.models.PersonGroups.create(data).then(() => next()).catch(next);
                    }, error => {
                        if (error) return reject(error);
                        return resolve(model);
                    });
                });
            })
            .then(model => {
                if (!options.cards) {
                    return model;
                }

                return new P((resolve, reject) => {
                    async.each(options.cards, (card, next) => {
                        let data = {
                            id_person    : model.id,
                            id_card_type : card.type,
                            number       : card.number
                        };

                        return this.models.PersonCards.create(data).then(() => next()).catch(next);
                    }, error => {
                        if (error) return reject(error);
                        return resolve(model);
                    });
                });
            });
    }

    updateWithAttributesWithoutTransaction(data, id, attributes, options)
    {
        options = options || {};

        return P.bind(this)
            .then(() => {
                return super.updateWithAttributesWithoutTransaction(data, id, attributes, options);
            })
            .then(model => {
                if (!options.groups) {
                    return model;
                }

                return P.bind(this)
                    .then(() => {
                        let optionsPrepared = {
                            where: {
                                id_person: model.id
                            }
                        };

                        return this.models.PersonGroups.getAll(optionsPrepared).then(groups => {
                            return _.reduce(groups, (memo, group) => {
                                if (!_.find(options.groups, ['id', group.id_group])) {
                                    memo.push(group);
                                }
                                return memo;
                            }, []);
                        });
                    })
                    .then(needRemoveGroups => {
                        if (_.isEmpty(needRemoveGroups)) {
                            return model;
                        }

                        return this.models.PersonGroups.destroy({
                            $in: _.map(needRemoveGroups, 'id')
                        });
                    })
                    .then(() => {
                        return new P((resolve, reject) => {
                            async.each(options.groups, (group, next) => {
                                P.bind(this)
                                    .then(() => {
                                        return this.models.PersonGroups.exists({
                                            where: {
                                                id_person : model.id,
                                                id_group  : group.id
                                            }
                                        });
                                    })
                                    .then(exists => {
                                        if (exists) {
                                            return next();
                                        }

                                        let data = {
                                            id_person : model.id,
                                            id_group  : group.id
                                        };

                                        return this.models.PersonGroups.create(data).then(() => next());
                                    })
                                    .catch(next);
                            }, error => {
                                if (error) return reject(error);
                                return resolve(model);
                            });
                        });
                    });
            })
            .then(model => {
                if (!options.cards || !options.cards.length) {
                    return model;
                }

                return P.bind(this)
                    .then(() => {
                        let data = {
                            number : options.cards[0].number
                        };

                        return this.models.PersonCards.update(data, model.cards[0].id);
                    });
            });
    }

    createGroup(group)
    {
        return P.bind(this)
            .then(() => {
                let data = {
                    id_company  : group.idCompany,
                    description : group.description
                };

                return this.models.Groups.create(data);
            });
    }

    populate(model, options)
    {
        options = options || {};

        return P.bind(this)
            .then(() => {
                return super.populate(model);
            })
            .then(() => {
                return this.models.PersonGroups.getByPerson(model.id).then(groups => {
                    model.groups = groups;
                    return model;
                });
            })
            .then(() => {
                return this.models.PersonCards.getByPerson(model.id).then(cards => {
                    model.cards = cards;
                    return model;
                });
            })
            .then(() => {
                if (options.withoutCompany) {
                    return model;
                }
                return this.models.Companies.getById(model.id_company).then(company => {
                    model.company = company;
                    delete model.id_company;
                    return model;
                });
            });
    }

    cacheKey(key, options) {
        let cacheKey = super.cacheKey(key, options);

        if (options.withoutCompany) {
            cacheKey = `${cacheKey}.without_company`;
        }
        return cacheKey;
    }
}

module.exports = new Model;
