'use strict';

const moment = require('moment');

const env = process.env.NODE_ENV || 'development';
const settings = require('../../config/settings.json')[env];
const models = require('../../models');
const strings = require('../../resources/string/resources');
const stringUtils = require('../../utils/string-formatter');
const tokenUtils = require('./token');

const Password = require('../../prototypes/password/password');
const UsernamePasswordNotMatchError = require('../../prototypes/responses/password/username-password-error');
const getUserWithPassword = require('./userPassword');

/**
 * function to check username and password of a user. The function checks for failed attempts and secures the user
 * after max attempts. The function checks for expiration of password and tracks login attempt of the user. The function
 * returns a value if user is sucessfully authenticated.
 * @param {string} username username of targeted user
 * @param {string} password password of targeted user
 * @returns {Object} Json object with user information and token
 */
const check = function (username, password) {
    let retrivedUser = null;
    return getUserWithPassword(username).then(user => {
        retrivedUser = user;

        return failedAttempts(user.failedAttempts, user.lastFailedAttempts, user.id);
    }).then(result => {
        if (result) {
            //throw error
            const error = new UsernamePasswordNotMatchError(strings.error.password.accountLocked);
            error.statusCode = 401;
            throw error;
        }

        return Password.compareKey(password, retrivedUser.password);
    }).then(matches => {
        return updateLoginAttempt(retrivedUser, matches);
    }).then(result => {
        return passwordExpire(retrivedUser.createdAt);
    }).then(result => {
        if (result) {
            const error = new UsernamePasswordNotMatchError(strings.error.password.passwordExpireError);
            error.statusCode = 403;
            throw error;
        }
        if (settings.checkActive && !retrivedUser.active) {
            const error = new UsernamePasswordNotMatchError(strings.error.user.userNotActive);
            error.statusCode = 401;
            throw error;
        }
        const payload = {
            id: retrivedUser.id,
            fullName: `${retrivedUser.firstname} ${retrivedUser.lastname}`,
            username: retrivedUser.username,
            email: retrivedUser.email,
            roleId: retrivedUser.roleId,
            role: retrivedUser.role,
            createdAt: retrivedUser.createdAt
        };
        const token = tokenUtils.generate(payload);
        return {
            ...payload,
            token: token
        };
    });
}

/**
 * function to update last signed in attr in user table
 * @param {number} userId user id of the user to update last sign in attr.
 */
const updateLastSignIn = function (userId) {
    return models.Users.update({ failedAttempts: 0, lastSignIn: new Date() }, { where: { id: userId } });
}

/**
 * function to check time to live of password.
 * @param {Date} passwordCreatedAt password created date
 */
const passwordExpire = function (passwordCreatedAt) {
    const today = moment();
    const createdAt = moment(passwordCreatedAt);

    const days = today.diff(createdAt, 'days');
    const life = settings.authentication.maxPasswordLife || 0;

    if (life > 0 && days > life) {
        return true;
    }

    return false;
}

/**
 * function to check the failed attempt for the user. Only continuous failed attempt is checked.
 * @param {number} attempts failed attempt
 * @param {Date} lastFailedAt last failed date for authentication
 * @param {number} userId user id of the user from user table
 * @returns {boolean} return true if user should be locked else false
 */
const failedAttempts = function (attempts, lastFailedAt, userId) {
    const maxAttempts = settings.authentication.maxFailedAttemp;
    const autoUnlockAfter = settings.authentication.autoUnlockAfter;

    if (maxAttempts < 1) {
        return false;
    }

    if (attempts < maxAttempts) {
        return false;
    }

    const lastFailedMoment = moment(lastFailedAt);
    const nowMomment = moment();
    const diff = nowMomment.diff(lastFailedMoment, 'minutes');

    if (autoUnlockAfter < 1) {
        return true;
    }

    if (diff > autoUnlockAfter) {
        return models.Users.update({ failedAttempts: 0 }, { where: { id: userId } }).then(result => {
            return false;
        });
    }

    return true;

}

/**
 * function to update last sign in of the user.
 * @param {Object} retrivedUser user information from user table
 * @param {boolean} isAuthenticated boolean to indicate is user is authenitcated sucessfully or not. True if authenticated
 */
const updateLoginAttempt = function (retrivedUser, isAuthenticated) {
    if (isAuthenticated) {
        return updateLastSignIn(retrivedUser.id);
    }

    return models.Users.findOne({
        attributes: ['failedAttempts'],
        where: { id: retrivedUser.id, deleted: false }
    }).then(user => {
        return models.Users.update({
            failedAttempts: (parseInt(user.failedAttempts) + 1),
            lastFailedAttempts: new Date()
        }, { where: { id: retrivedUser.id } })
    }).then(result => {
        const error = new UsernamePasswordNotMatchError(strings.error.password.usernamePasswordNotMatchError);
        error.statusCode = 401;
        throw error;
    });
}

module.exports = check;
