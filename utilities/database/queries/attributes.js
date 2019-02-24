"use strict";

module.exports = {
    byEntity : function(entity, id) {
        return `SELECT ea.*, a.description AS name, t.description AS type FROM ${entity}_attributes AS ea JOIN attributes AS a ON a.id = ea.id_attribute JOIN attribute_types AS t ON t.id = a.id_attribute_type AND t.id != 12 WHERE ea.id_${entity} = ${id}`;
    }
};
