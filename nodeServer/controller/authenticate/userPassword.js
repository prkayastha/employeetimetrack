const models = require('../../models');
const UsernamePasswordNotMatchError = require('../../prototypes/responses/password/username-password-error');

/**
 * Gets password for the username from password table
 * @param {string} username username of the user from user table
 * @returns {Promise<Object>} row of the password table for username
 */
const getUserWithPassword = function (username) {
    const query = "SELECT `user`.`id`, `user`.`username`, `user`.`email`, `user`.`lastSignIn`, `user`.`active`,\
     `user`.`failedAttempts`, `user`.`lastFailedAttempts`, `password`.`createdAt`,\
     `password`.`password` FROM Passwords `password` INNER JOIN Users `user` ON `password`.`userId` = `user`.`id` WHERE\
      userId =(SELECT id FROM Users `user` WHERE `user`.`username` = :username AND `user`.`deleted` IS FALSE) ORDER BY\
       `password`.`createdAt` DESC LIMIT 1";

    return models.sequelize.query(query, {
        replacements: { username: username },
        type: models.Sequelize.QueryTypes.SELECT
    }).then(rows => {
        if (rows.length < 1) {
            const error = new UsernamePasswordNotMatchError(stringUtils.format(strings.error.user.userNotFoundByUsername, username));
            error.statusCode = 401;
            throw error;
        }
        return Promise.resolve(rows[0]);
    });
}

module.exports = getUserWithPassword;