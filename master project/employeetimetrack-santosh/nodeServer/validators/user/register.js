const {checkSchema } = require('express-validator');

module.exports = checkSchema({
    firstname: {
        in: 'body',
        exists: true,
        isEmpty: {
            negated: true
        }
    },
    lastname: {
        in: 'body',
        exists: true,
        isEmpty: {
            negated: true
        }
    },
    email: {
        in: 'body',
        exists: true,
        isEmail: true
    },
    password: {
        in: 'body',
        exists: true,
        isLength: {
            options: {min: 8},
            errorMessage: 'Password should atleast be 8 characters in length'
        }
    }
});