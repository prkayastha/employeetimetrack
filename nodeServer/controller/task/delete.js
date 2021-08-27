const models = require('../../models');
const UnauthorizedError = require('../../prototypes/responses/authorization/unauthorized');
const SuccessResponse = require('../../prototypes/responses/global.success');
const TaskNotFountError = require('../../prototypes/responses/task/task-not-found.error');

const stringRes = require('../../resources/string/resources');
const stringUtil = require('../../utils/string-formatter');

module.exports = async function (operatorInfo, taskId) {
    const taskToDelete = await models.Task.findOne({ where: { isDelete: false, id: taskId } });

    if (!taskToDelete) {
        const errMsg = stringUtil.format(stringRes.error.task.notFound, taskId);
        const error = new TaskNotFountError(errMsg);
        throw error;
    }

    const allowDelete = await canDeleteTask(operatorInfo, taskToDelete.projectId);

    if (!allowDelete) {
        const error = new UnauthorizedError();
        throw error;
    }

    const deleteResult = await models.Task.update({
        isDelete: true,
    }, { where: { id: taskId } });

    if (!deleteResult.length) {
        const error = new Error('No task were deleted');
    }

    const successMsg = stringUtil.format(stringRes.task.deleteSuccess, taskToDelete.id);
    const response = SuccessResponse.getSuccessResponse(200, successMsg);
    return response;
}

async function canDeleteTask(operationInfo, projectId) {
    const userId = operationInfo.id;
    const query = 'SELECT `userroles`.`UserId`, `userroles`.`RoleId`, `roles`.`role` \
    FROM `user_management`.`userroles` `userroles` INNER JOIN `user_management`.`roles` \
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
        const projectInfo = await models.Project.findOne({ attribute: ['id', 'projectName'], where: { id: projectId } });
        if (projectInfo.projectOwnerUserId == operationInfo.id) {
            return true;
        }
        return false;
    } else {
        return false;
    }
}