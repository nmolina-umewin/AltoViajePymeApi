"use strict";

const CustomError = require('./custom-error');

module.exports = {
    Internal : new CustomError("Internal Server Error.", {code: 500}),
    CannotExecuteQuery : new CustomError("The system cannot execute the query.", {code: 500}),
    NotExists : {
        User : new CustomError("The given user doesn't exist.", {code: 404}),
        Users : new CustomError("The given users doesn't exist.", {code: 404}),
        Permission : new CustomError("The given permission doesn't exist.", {code: 404}),
        Permissions : new CustomError("The given permissions doesn't exist.", {code: 404}),
        Company : new CustomError("The given company doesn't exist.", {code: 404}),
        Companies : new CustomError("The given companies doesn't exist.", {code: 404}),
    },
    Format : {
        Token : new CustomError("The given token is not well-formed", {code: 400}),
        JSON  : new CustomError("The given JSON is not well-formed", {code: 400})
    },
    CustomError
};
