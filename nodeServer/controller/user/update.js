const models = require('../../models');
const SuccessResponse = require('../../prototypes/responses/global.success');

const stringResources = require('../../resources/string/resources');
const stringUtils = require('../../utils/string-formatter');
const env = process.env.NODE_ENV || 'development';
const settings = require('../../config/settings.json')[env];

const UnauthorizedError = require('../../prototypes/responses/authorization/unauthorized');
const UserNotFoundError = require('../../prototypes/responses/user/error.user.not.found');
const OptimisticLockError = require('../../prototypes/responses/optimistic-lock-error');
const { sequelize } = require('../../models');

/**
 * function to update user by id. Attribute that are to be updated must be passed. All the other attributes are ignored.
 * @param {number} userId user id of user to be updated
 * @param {Object} infoToUpdate updated information of the user.
 * @returns Promise<SuccessResponse>
 * @throws {UserNotFoundError}
 */
const update = function (operatorInfo, userId, infoToUpdate) {
    /* if (operatorInfo.id !== userId) {
        const error = new UnauthorizedError('Unauthorized to update');
        error.statusCode = 400;
        return Promise.reject(error);
    } */

    const whereCondition = { id: userId, deleted: false };
    const immutableField = ['id', 'lastSignIn', 'deleted', 'active', 'createdAt', 'updatedAt', 'username', 'password'];

    let cacheOperatorRole = null;

    return getOperatorInfo(operatorInfo.id).then(operator => {
        const role = operator.roles.filter(role => role.role).pop();
        cacheOperatorRole = role.role;

        return models.Users.findOne({ where: whereCondition });
    }).then(user => {
        if (!user) {
            const message = stringResources.error.user.userNotFoundById;
            const error = new UserNotFoundError(stringUtils.format(message, userId));
            error.statusCode = 400;
            throw error;
        }

        const updateData = user.dataValues;

        if (updateData.version !== infoToUpdate.version) {
            const error = new OptimisticLockError();
            throw error;
        }

        for (let attr of Object.keys(infoToUpdate)) {
            if (!immutableField.includes(attr) && updateData.hasOwnProperty(attr)) {
                if (!!infoToUpdate[attr]) {
                    updateData[attr] = infoToUpdate[attr];
                }
            }
        }

        if (!settings.seperateUsername) {
            updateData.username = updateData.email;
        }

        updateData.version = parseInt(infoToUpdate.version, 10) + 1;

        let promise = null;

        if (cacheOperatorRole === 'ADMIN') {
            promise = models.Users.update(updateData, {
                where: whereCondition
            }).then(result => {
                if (result < 0) {
                    const message = stringResources.error.user.updateFailure;
                    const error = new UserUpdateError(stringUtils.format(message, userId));
                    error.statusCode = 400;
                    throw error;
                }

                if (!!infoToUpdate.Roles) {
                    return updateRoles(infoToUpdate.roles, userId);
                }

                return true;
            })
        } else if (cacheOperatorRole === 'MANAGER') {
            promise = models.Users.update(updateData, {
                where: whereCondition
            });
        }

        return promise.then(result => {
            const message = stringResources.user.updateSuccess;
            const response = SuccessResponse.getSuccessResponse(200, stringUtils.format(message, userId));
            return Promise.resolve(response);
        });
    });
}

function updateRoles(roles, userId) {
    let query = 'DELETE FROM UserRoles where userId = ?';

    let rows = roles.map(each => {
        return { RoleId: each, UserId: userId };
    });

    return sequelize.transaction(t => {
        let deleteQuery = sequelize.query(
            query,
            {
                replacements: [userId],
                type: sequelize.Sequelize.QueryTypes.DELETE,
                transaction: t
            }
        );

        let insertQuery = models.UserRole.bulkCreate(
            rows,
            { transaction: t }
        );

        return deleteQuery.then(result => {
            return insertQuery
        });
    }).then(result => {
        return result[1];
    });

}

function getOperatorInfo(operatorId) {
    const whereCondition = { id: operatorId, deleted: false };
    return models.Users.findOne({
        attributes: ['id'],
        include: [
            { model: models.Roles, as: 'roles' }
        ],
        where: whereCondition
    });
}

module.exports = update;
