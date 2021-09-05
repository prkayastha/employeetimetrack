// const bcrypt = require('bcrypt');
const crypto = require('crypto');
const env = process.env.NODE_ENV || 'development';
const settings = require('../../config/settings.json')[env];
const PasswordPatternError = require('../../prototypes/responses/password/password-pattern.error');
const stringRes = require('../../resources/string/resources');

class Password {
    constructor() {
        this.password = null;
        this.UserId = null;
    }

    static setPassword(userId, password) {
        const passwordObject = new Password();
        passwordObject.UserId = userId;

        if (!!settings.passwordPattern) {
            const checkPattern = isPatternCorrect(password);
            if (!checkPattern) {
                throw new PasswordPatternError(stringRes.error.password.patternError);
            }
        }

        return generatePassword(password).then(hashPassword => {
            passwordObject.password = hashPassword;

            return passwordObject;
        });
    }

    static compareKey(plainText, hashedString) {
        return comparePassword(plainText, hashedString);
    }
}

const generatePassword = function(plainText) {
    const salt = settings.authentication.hashSalt;
    /* return bcrypt.hash(plainText, salt).then(hashPassword => {
        return hashPassword;
    }); */
    const hash = crypto.createHash('sha256').update(plainText).digest('base64');
    return Promise.resolve(hash);
}

const comparePassword = function(plainText, hashedString) {
    return generatePassword(plainText).then(hash => {
        if(hash!==hashedString) {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    })
}

const isPatternCorrect = function (password) {
    const pattern = settings.passwordPattern;
    const regex = new RegExp(pattern);
    return regex.test(password);
}

module.exports = Password;
