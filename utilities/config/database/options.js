'use strict';

module.exports = {
    OmitOptions         : ['attributes', 'where', 'order', 'group', 'limit', 'offset'],
    DefaultFieldId      : 'id',
    DefaultWriteOptions : {},
    DefaultReadOptions  : {
        raw   : true,
        lazy  : false,
        cache : true
    }
};
