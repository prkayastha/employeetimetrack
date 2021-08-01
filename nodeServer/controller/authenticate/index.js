const checkUsernamePassword = require('./check-password');
const checkUsernamePasswordOnly = require('./check-password-only');
const reset = require('./resetLink')

/**
 * export modules for authenticate
 */
module.exports = {
    checkUsernamePassword,
    checkUsernamePasswordOnly,
    reset
};
