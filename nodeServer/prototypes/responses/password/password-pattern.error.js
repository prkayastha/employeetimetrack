const ErrorResponse = require("../global.error");

class PasswordPatternError extends ErrorResponse {

    constructor(message) {
        super('Password pattern not match')
        this.statusCode = 400;
        if (!!message) {
            this.message = message;
        }
    }
}

module.exports = PasswordPatternError;