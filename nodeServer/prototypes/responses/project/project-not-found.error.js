const ErrorResponse = require("../global.error");

class ProjectNotFoundError extends ErrorResponse {
    constructor() {
        super('No project found')
        this.statusCode = 400;
        this.name = 'ProjectNotFoundError';
    }
}

module.exports = ProjectNotFoundError;