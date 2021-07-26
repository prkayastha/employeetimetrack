const db = require('../../models')
const randomstring = require('randomstring');
const ResetLinkError = require('../../prototypes/responses/authorization/resetlink.error');
const strings = require('../../resources/string/resources');

/**
 * Generates reset link that is saved to node-cache. Additionally check the limits for
 * recursion.
 * @param {number} userId user id from user table
 * @returns {Promise<string>} Promise that resolves reset link
 */
const generateLink = function (userId, count) {
    const link = generate();

    return new Promise((resolve, reject) => {
        const retrive = db.cache.get(link);
        if (retrive == undefined) {
            resolve(true);
        }
        reject(false);
    }).then(() => {
        return new Promise((resolve, reject) => {
            db.cache.set(link, userId);
            resolve(link)
        })
    }).catch(error => {
        if (count < 5) {
            return generateLink(userId, count+1);
        } else {
            console.log(error);
            throw new Error('Link generation attempt exceeded more than 5 times');
        }
    });
}

/**
 * Generates reset link that is saved to node-cache
 * @param {number} userId user id from user table
 * @returns {Promise<string>} Promise that resolves reset link
 */
const generateLinkLim = function (userId) {
    return generateLink(userId, 0).then((link) => {
        return Promise.resolve({
            'link': link,
            'userId': userId
        });
    }).catch(error => {
        return Promise.reject(new ResetLinkError(error.message));
    })
}

/**
 * Checks reset code from the node-cache
 * @param {string} link rest code for password
 * @returns {Promise<Object>} return a promise that resolves user id for the reset code. 
 */
const checkLink = function(link) {
    const linkUserId = db.cache.get(link);

    return new Promise((resolve, reject) => {
        if (linkUserId == undefined) {
            reject(new ResetLinkError(strings.error.password.unauthorizedlink));
        }

        resolve({
            userId: linkUserId
        });
    });
}

/**
 * function to generate random string
 * @returns {string} random string
 */
function generate() {
    return randomstring.generate({
        length: 32,
        charset: 'alphanumeric',
        capitalization: 'lowercase'
    });
}

module.exports = {
    generateLinkLim,
    checkLink
}