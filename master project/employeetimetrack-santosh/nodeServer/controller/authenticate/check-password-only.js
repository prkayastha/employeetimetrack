const env = process.env.NODE_ENV || 'development';
const strings = require('../../resources/string/resources');

const getUserWithPassword = require('./userPassword');
const Password = require('../../prototypes/password/password');
const UsernamePasswordNotMatchError = require('../../prototypes/responses/password/username-password-error');

/**
 * function to check username and password of a user without increasing the failed attempt.
 * @param {string} username username of targeted user
 * @param {string} password password of targeted user
 */
const check = function (username, password) {
    return getUserWithPassword(username).then(user => {
        retrivedUser = user;

        return Password.compareKey(password, retrivedUser.password);
    }).then(result => {
        if (!result) {
            //throw error
            const error = new UsernamePasswordNotMatchError(strings.error.password.oldPasswordNotMatch);
            error.statusCode = 401;
            throw error;
        }

        return Promise.resolve(true);        
    });
}

module.exports = check;