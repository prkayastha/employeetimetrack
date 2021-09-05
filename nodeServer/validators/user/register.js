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
        exists: true
    }
});