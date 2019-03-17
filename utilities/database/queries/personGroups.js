"use strict";

module.exports = {
    byPerson : function(idPerson) {
        return `SELECT g.id FROM groups AS g JOIN person_groups AS pg ON pg.id_group = g.id AND pg.id_person = ${idPerson} ORDER BY g.id DESC, g.created_at DESC, g.updated_at DESC`;
    }
};
