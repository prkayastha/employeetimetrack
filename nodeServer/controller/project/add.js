const models = require('../../models');

const ProjectModel = require('../../prototypes/project/project');
const stringRes = require('../../resources/string/resources');

const OptimisticLockError = require('../../prototypes/responses/optimistic-lock-error');
const ProjectError = require('../../prototypes/responses/project/project-create.error');
const UnauthorizedError = require('../../prototypes/responses/authorization/unauthorized');

const momentTz = require('moment-timezone');
const Op = models.Sequelize.Op;

module.exports = async function (operationInfo, projectInfo) {
    const projectObj = new ProjectModel(projectInfo);
    let operation = projectObj.id == 0 ? 'add' : 'update';
    try {
        if (operation === 'add') {
            var responseProject = null;
            const result = await models.sequelize.transaction(async (t) => {
                const responseProject = await models.Project.bulkCreate(
                    [projectObj],
                    {
                        updateOnDuplicate: ['projectName', 'createdByUserId', 'projectOwnerUserId'],
                        transaction: t
                    }
                );

                const insertResult = await addAssignment(t, projectInfo.assignee, responseProject[0].id);
                return responseProject;
            });

            return result[0];
        } else if (operation === 'update') {
            const isUpdateable = await checkUpdatable(operationInfo, projectObj);
            if (!isUpdateable) {
                throw new UnauthorizedError('User does not have access for the project');
            }
            projectObj.createdByUserId = isUpdateable.createdByUserId;
            projectObj.projectOwnerUserId = projectObj.projectOwnerUserId;
            projectObj.version = isUpdateable.version + 1;
            let result = await models.sequelize.transaction(async (t) => {
                const responseProject = await models.Project.bulkCreate(
                    [projectObj],
                    {
                        updateOnDuplicate: ['projectName', 'projectOwnerUserId', 'isDelete', 'version'],
                        transaction: t
                    }
                );

                const insertResult = await addAssignment(t, projectInfo.assignee, responseProject[0].id);
                return responseProject;
            })
            
            return result[0];
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
    if (operatorInfo.role === 'ADMIN') {
        return project;
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

async function addAssignment(transaction, assignee, projectId) {
    const now = momentTz(momentTz(), momentTz.tz.guess()).format('YYYY-MM-DDTHH:mm:ssZ');

    assignee = assignee.map(assignee => ({ProjectId: projectId, UserId: assignee, createdAt: now, updatedAt: now}));
    const assignedRows = await models.UserProject.findAll({
        where: { ProjectId: projectId },
        transaction
    });

    const onlyA = assignee.filter(user => {
        const hasAssignedRow = assignedRows.find(row => row.UserId == user.UserId);
        return !hasAssignedRow;
    });
    
    const AintersectB = assignee.filter(user => {
        const hasAssignedRow = assignedRows.find(row => row.UserId == user.UserId);
        return hasAssignedRow;
    });

    const deleteResult = await models.UserProject.destroy({
        where: {
            ProjectId: projectId,
            UserId: {
                [Op.notIn]: AintersectB.map(user => user.UserId)
            }
        },
        transaction: transaction
    });

    const insertOperation = await models.UserProject.bulkCreate(onlyA, {transaction})

    return insertOperation;
}
