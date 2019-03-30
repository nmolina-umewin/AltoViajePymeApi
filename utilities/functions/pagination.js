"use strict";

function pagination(query, defaultPageSize = 0) 
{
    if (!query) {
        return {};
    }

    let pageSize = Number(query.pageSize || defaultPageSize);
    let page = Number(query.page || 1) - 1;

    if (!pageSize) {
        return;
    }

    return {
        limit  : pageSize,
        offset : page * pageSize
    };
}

module.exports = pagination;
