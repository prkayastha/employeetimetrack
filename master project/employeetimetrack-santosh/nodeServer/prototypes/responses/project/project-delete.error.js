const ErrorResponse = require("../global.error");

class ProjectDeleteError extends ErrorResponse {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.name = 'ProjectDeleteError'
    }
}

module.exports = ProjectDeleteError;