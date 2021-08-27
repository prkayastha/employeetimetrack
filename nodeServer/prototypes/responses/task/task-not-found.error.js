const ErrorResponse = require("../global.error");

class TaskNotFountError extends ErrorResponse {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.name = 'TaskNotFoundError';
    }
}

module.exports = TaskNotFountError;