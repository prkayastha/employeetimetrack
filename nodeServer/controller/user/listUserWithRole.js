const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../models');
const getUserRole = require('./getUserRole');

/**
 * function to list all the users
 * @param {Object} options list options
 */
const list = async function (roleId) {
    const whereCondition = {
        deleted: false
    };

    const listQuery = {
        attributes: ['id', 'firstname', 'lastname'],
        include: [
            { model: models.Roles, as: 'roles', where: { id: +roleId } }
        ],
        offset: 0,
        limit: null,
        order: [['firstname', 'asc'], ['lastname', 'asc']],
        where: whereCondition
    };
    const userCollection = await models.Users.findAll(listQuery)

    return userCollection.map(user => ({id: user.id, name: `${user.firstname} ${user.lastname}`}));
};

module.exports = list;
