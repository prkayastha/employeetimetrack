const models = require('../../models');
const Sequelize = require('sequelize');
const UnauthorizedError = require('../../prototypes/responses/authorization/unauthorized');
const Op = Sequelize.Op;

const stringRes = require('../../resources/string/resources');

module.exports = async function (operatorInfo, options, projectId) {

    const hasAccess = await canAccessProject(operatorInfo, projectId);

    if (!hasAccess) {
        const error = new UnauthorizedError(stringRes.error.authorization.unauthorize);
        throw error;
    }

    const whereObj = {};
    whereObj.projectId = +projectId;
    if (!!options.search) {
        whereObj.taskDescription = {
            [Op.like] : '%'+options.search.trim()+'%'
        }
    }
    const queryOptions = {
        offset: +options.offset,
        limit: +options.limit,
        attributes: {
            include: [[Sequelize.fn('duration', Sequelize.col(`id`), operatorInfo.id),'timeDuration']]
        },
        order: [[options.orderBy, options.order]],
        where: whereObj 
    };

    const list = models.Task.findAll(queryOptions);

    const cpQueryOptions = {
        where: queryOptions.where
    };

    const count = models.Task.count(cpQueryOptions);
    const result = await Promise.all([count, list])
    return {totalRecords: result[0], collection: result[1]};
};

async function canAccessProject(operatorInfo, projectId) {
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
        //TODO: employee can access the project only if s/he is assigned to it.
        const query = 'SELECT * FROM UserProjects `userProject` where `userProject`.`UserId` = :userId AND `userProject`.`ProjectId` = :projectId LIMIT 1';

        const roleRow = await models.sequelize.query(
            query,
            {
                type: models.Sequelize.QueryTypes.SELECT,
                replacements: { userId: operatorInfo.id, projectId }
            }
        );

        if (roleRow.length < 1) {
            return false;
        }
        return true;
    }
}

