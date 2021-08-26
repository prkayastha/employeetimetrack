const models = require('../../models');

const ProjectModel = require('../../prototypes/project/project');
const stringRes = require('../../resources/string/resources');

const OptimisticLockError = require('../../prototypes/responses/optimistic-lock-error');
const ProjectError = require('../../prototypes/responses/project/project-create.error');
const UnauthorizedError = require('../../prototypes/responses/authorization/unauthorized');

module.exports = async function (operationInfo, projectInfo) {
    const projectObj = new ProjectModel(projectInfo);
    let operation = projectObj.id == 0 ? 'add' : 'update';
    try {
        if (operation === 'add') {
            const responseProject = await models.Project.bulkCreate(
                [projectObj],
                {
                    updateOnDuplicate: ['projectName', 'createdByUserId', 'projectOwnerUserId']
                }
            );
            return responseProject[0];
        } else if (operation === 'update') {
            const isUpdateable = await checkUpdatable(operationInfo, projectObj);
            if (!isUpdateable) {
                throw new UnauthorizedError('User does not have access for the project');
            }
            projectObj.createdByUserId = isUpdateable.createdByUserId;
            projectObj.projectOwnerUserId = isUpdateable.projectOwnerUserId;
            projectObj.version = isUpdateable.version + 1;
            const responseProject = await models.Project.bulkCreate(
                [projectObj],
                {
                    updateOnDuplicate: ['projectName', 'projectOwnerUserId', 'version']
                }
            );
            return responseProject[0];
        } else {
            throw new Error('No operations');
        }
    } catch (error) {
        if (error instanceof OptimisticLockError
            || error instanceof UnauthorizedError) {
                throw error;
            }

        if (operation === 'add') {
            error = new ProjectError(stringRes.error.project.create);
        } else if (operation === 'update') {
            error = new ProjectError(stringRes.error.project.update);
        }

        throw error;
    }
};

async function checkUpdatable(operatorInfo, projectInfo) {
    let project = await models.Project.findOne({ where: { id: projectInfo.id } });
    if (!project) {
        const error = new Error('No project found');
        throw error;
    }
    if (project.projectOwnerUserId != operatorInfo.id) {
        return null;
    }
    if (projectInfo.version != project.version) {
        const error = new OptimisticLockError();
        throw error;
    }
    return project;
}