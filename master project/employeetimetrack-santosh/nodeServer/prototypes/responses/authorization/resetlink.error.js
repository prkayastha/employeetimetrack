'use strict';
const ErrorResponse = require('../global.error');

class ResetLinkError extends ErrorResponse {
    constructor(message) {
        super(message);
        this.name = 'ErrorResponse';
        this.statusCode = 400;
    }
}

module.exports = ResetLinkError;
