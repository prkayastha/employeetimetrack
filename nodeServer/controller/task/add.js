const models = require('../../models');

const stringRes = require('../../resources/string/resources'),
    stringUtil = require('../../utils/string-formatter');

const UnauthorizedError = require('../../prototypes/responses/authorization/unauthorized');
const OptimisticLockError = require('../../prototypes/responses/optimistic-lock-error');
const TaskNotFountError = require('../../prototypes/responses/task/task-not-found.error');

module.exports = async function (operatorInfo, taskInfo) {
    const canAdd = await canAddTask(operatorInfo, taskInfo.projectId);
    const operation = !taskInfo.id ? 'add' : 'update';

    if (!canAdd) {
        const error = new UnauthorizedError();
        throw error;
    }

    if (operation === 'add') {
        const task = await models.Task.bulkCreate([taskInfo], { updateOnDuplicate: ['taskDescription', 'assigneeUserId', 'version'] });
        return task[0];
    } else if (operation === 'update') {
        const taskToUpdate = await models.Task.findOne({ where: { id: taskInfo.id } });
        if (!taskToUpdate) {
            const errMsg = stringUtil.format(stringRes.error.task.notFound, taskInfo.id);
            const error = new TaskNotFountError(errMsg);
            throw error;
        }

        if (taskToUpdate.version != taskInfo.version) {
            const error = new OptimisticLockError();
            throw error;
        }

        taskInfo.version = taskToUpdate.version + 1;
        const task = await models.Task.bulkCreate([taskInfo], { updateOnDuplicate: ['taskDescription', 'assigneeUserId', 'version'] });
        return task[0];
    } else {
        const error = new Error('Invalid operation');
        throw error;
    }
};

async function canAddTask(operatorInfo, projectId) {
    const userId = operatorInfo.id;
    const query = 'SELECT `userroles`.`UserId`, `userroles`.`RoleId`, `roles`.`role` \
    FROM `user_management`.`UserRoles` `userroles` INNER JOIN `user_management`.`Roles` \
    `roles` ON `userroles`.`RoleId` = `roles`.`id` WHERE `userroles`.`UserId` = :userId LIMIT 1';

    let row = await models.sequelize.query(
        query,
        {
            replacements: { userId },
            type: models.Sequelize.QueryTypes.SELECT
        }
    );

    if (row[0].role === 'ADMIN') {
        return true;
    } else if (row[0].role === 'MANAGER') {
        const projectInfo = await models.Project.findOne({ attribute: ['id', 'projectName', 'projectOwnerUserId'], where: { id: projectId } });
        if (projectInfo.projectOwnerUserId == operatorInfo.id) {
            return true;
        }
        return false;
    } else {
        return false;
    }
}