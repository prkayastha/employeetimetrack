const models = require('../../models');

const SuccessResponse = require('../../prototypes/responses/global.success');

const UnauthorizedError = require("../../prototypes/responses/authorization/unauthorized");
const ProjectDeleteError = require('../../prototypes/responses/project/project-delete.error');
const ProjectNotFoundError = require('../../prototypes/responses/project/project-not-found.error');

module.exports = async function (operatorInfo, projectId) {
    let project = await models.Project.findOne({ where: { id: projectId, isDelete: false } });
    if (!project) {
        const error = new ProjectNotFoundError();
        throw error;
    }
    if (project.projectOwnerUserId != operatorInfo.id && project.createdByUserId != operatorInfo.id) {
        throw new UnauthorizedError("Unauthorized to access the project");
    }
    let result = await models.Project.update(
        { isDelete: true, version: project.version + 1 }, 
        { where: { id: projectId } }
    );
    if (!result) {
        throw new ProjectDeleteError('Cannot delete project')
    }
    return SuccessResponse.getSuccessResponse(200, "Project successfully deleted");
};