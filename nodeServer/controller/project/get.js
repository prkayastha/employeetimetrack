const models = require('../../models');
const UnauthorizedError = require("../../prototypes/responses/authorization/unauthorized");

module.exports = async function(operatorInfo, projectId) {
    let project = await models.Project.findOne({ where: { id: projectId } });
    if (!project) {
        const error = new Error('No project found');
        throw error;
    }
    if (project.projectOwnerUserId != operatorInfo.id && project.createdByUserId != operatorInfo.id) {
        throw new UnauthorizedError("Unauthorized to access the project");
    }
    return project;
};