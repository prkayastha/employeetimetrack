const ErrorResponse = require("../global.error");

class ProjectCreateUpdateError extends ErrorResponse {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.name = 'ProjectCreateUpdateError'
    }
}

module.exports = ProjectCreateUpdateError;