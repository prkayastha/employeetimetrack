const models = require('../../models');

const stringResources = require('../../resources/string/resources');
const stringUtils = require('../../utils/string-formatter');

const UserNotFoundError = require('../../prototypes/responses/user/error.user.not.found');
const UnauthorizedError = require('../../prototypes/responses/authorization/unauthorized');

/**
 * function to get user by id
 * @param {number} userId user id of user to be retrived
 */
const getUserById = function (userId, queryUser) {

    if (!queryUser) {
        return getUser(userId);
    }

    let queryUserInfoCache = null;
    return getUser(queryUser.id).then(queryUserInfo => {
        queryUserInfoCache = queryUserInfo;
        const roles = queryUserInfo.roles.map(role => role.role);
        const role = roles.pop();

        if (role === 'EMPLOYEE' && userId != queryUser.id) {
            const unauthorizedError = new UnauthorizedError(stringResources.error.authorization.unauthorizeForOp);
            throw unauthorizedError
        }

        return getUser(userId)
    }).then((retrivedUser) => {
        const retrivedUserRole = retrivedUser.roles.map(role => role.role).pop();
        const queryUserRole = queryUserInfoCache.roles.map(role => role.role).pop();

        if (
            (queryUserRole === 'MANAGER' && retrivedUserRole === 'ADMIN') ||
            (queryUserRole === 'MANAGER' && retrivedUserRole === 'MANAGER' && queryUserInfoCache.id != retrivedUser.id)
        ) {
            const unauthorizedError = new UnauthorizedError(stringResources.error.authorization.unauthorizeForOp);
            throw unauthorizedError
        }

        return retrivedUser;
    });
}

function getUser(userId) {
    const whereCondition = { id: userId, deleted: false };
    return models.Users.findOne({
        include: [
            { model: models.Roles, as: 'roles' }
        ],
        where: whereCondition
    }).then(user => {
        if (!user) {
            const message = stringResources.error.user.userNotFoundById;
            const error = new UserNotFoundError(stringUtils.format(message, userId));
            error.statusCode = 400;
            throw error;
        }

        const userCp = { ... user.dataValues};
        userCp.roles = userCp.roles.map(role => {
            return {id: role.id, role: role.role}
        });

        return Promise.resolve(userCp);
    });
}

module.exports = getUserById;
