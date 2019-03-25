'use strict';

const Op = require('sequelize').Op;

module.exports = {
    database    : 'av_pyme',
    dialect     : 'mysql',
    logging     : false,
    port        : 3306,
    replication : {
        read    : [{
            host     : 'localhost',
            username : 'av_db_user',
            password : '05D06455cbfcf7eec1a6d03a18a1ffbe!'
        }],
        write   : {
            host     : 'localhost',
            username : 'av_db_user',
            password : '05D06455cbfcf7eec1a6d03a18a1ffbe!'
        }
    },
    dialectOptions: {
        decimalNumbers: true
    },
    operatorsAliases: {
        $eq: Op.eq,
        $ne: Op.ne,
        $gte: Op.gte,
        $gt: Op.gt,
        $lte: Op.lte,
        $lt: Op.lt,
        $not: Op.not,
        $in: Op.in,
        $notIn: Op.notIn,
        $is: Op.is,
        $like: Op.like,
        $notLike: Op.notLike,
        $iLike: Op.iLike,
        $notILike: Op.notILike,
        $regexp: Op.regexp,
        $notRegexp: Op.notRegexp,
        $iRegexp: Op.iRegexp,
        $notIRegexp: Op.notIRegexp,
        $between: Op.between,
        $notBetween: Op.notBetween,
        $overlap: Op.overlap,
        $contains: Op.contains,
        $contained: Op.contained,
        $adjacent: Op.adjacent,
        $strictLeft: Op.strictLeft,
        $strictRight: Op.strictRight,
        $noExtendRight: Op.noExtendRight,
        $noExtendLeft: Op.noExtendLeft,
        $and: Op.and,
        $or: Op.or,
        $any: Op.any,
        $all: Op.all,
        $values: Op.values,
        $col: Op.col
    }
};
