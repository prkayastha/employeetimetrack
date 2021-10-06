const models = require('../../models');
const UnauthorizedError = require("../../prototypes/responses/authorization/unauthorized");
const ProjectNotFoundError = require('../../prototypes/responses/project/project-not-found.error');

module.exports = async function (operatorInfo, projectId) {
    let project = await models.Project.findOne({
        include: [
            { model: models.Users, as: 'projectOwner', attributes: ['id', 'firstname', 'lastname'] },
            { model: models.Users, as: 'assignees', attributes: ['id', 'firstname', 'lastname'] }
        ],
        where: { id: projectId }
    });
    if (!project) {
        const error = new ProjectNotFoundError();
        throw error;
    }
    if ((project.projectOwnerUserId != operatorInfo.id && project.createdByUserId != operatorInfo.id) && operatorInfo.role !== 'ADMIN') {
        throw new UnauthorizedError("Unauthorized to access the project");
    }
    const projectOwner = {
        id: project.projectOwner.id,
        name: `${project.projectOwner.firstname} ${project.projectOwner.lastname}`
    }

    let assignees = null;
    if (!!project.assignees) {
        assignees = project.assignees.map(assignee => ({ id: assignee.id, name: `${assignee.firstname} ${assignee.lastname}` }));
    }

    return {...project.dataValues, projectOwner, assignees};
};