const models = require('../../models');
const Sequelize = require('sequelize');

async function getUserRole(userId) {
    const query = 'SELECT `role`.* FROM UserRoles `userRole` INNER JOIN Roles `role` ON\
    `userRole`.`RoleId` = `role`.`id` WHERE `userRole`.`userId` = :userId;';

    const result = await models.sequelize.query(
        query,
        {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { userId }
        }
    );

    return result[0];
}

module.exports = getUserRole;