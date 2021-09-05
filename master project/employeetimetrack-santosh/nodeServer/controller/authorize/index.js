const jwt = require('express-jwt');
const env = process.env.NODE_ENV || 'development';
const setting = require('../../config/settings.json')[env];
const secret = setting.tokenSecret;

const user = require('../user');
const UnauthorizedError = require('../../prototypes/responses/authorization/unauthorized');

const strings = require('../../resources/string/resources');
const errorHandler = require('../errorHandler');

/**
 * Middleware checks the roles of the user. Provides result if the user is accssible for
 * the end point or not
 * @param {ROLES[]} roles Roles to have access for the end point
 * @returns Middleware to check roles
 */
function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret }),
        async (req, res, next) => {
            const currentUser = req.user;
            const userRoles = await getUserRoles(currentUser.id);
            try {
                const accessRole = roles.filter(role => userRoles.includes(role)) || [];
                if (!accessRole.length) {
                    const error = new UnauthorizedError(strings.error.authorization.unauthorize);
                    throw error;
                }
                next();
            } catch (error) {
                errorHandler(res, error);
            }
        }
    ];

}

/**
 * Roles to authorize the endpoints
 */
const ROLES = {
    'ADMIN': 'ADMIN',
    'MANAGER': 'MANAGER',
    'EMPLOYEE': 'MANAGER'
};

/**
 * Get user roles
 * @param {number} userId User id for the user table
 * @returns roles based on user role table
 */
const getUserRoles = async (userId) => {
    try {
        let currentUser = await user.get(userId);
        if (!!currentUser) {
            return currentUser.roles.map(roles => roles.role);
        }
    } catch (error) {
        return [];
    }

}

module.exports = {
    allow: authorize,
    ROLES
};