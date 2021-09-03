const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../models');

/**
 * function to list all the users
 * @param {Object} options list options
 */
const list = function (options) {
    const whereCondition = {
        deleted: false
    };
    const offsetRows = options.offset || 0;
    const limitRows = options.limit || 10;
    
    let searchString = options.searchQuery.trim()+'%';
    if (searchString != null && searchString.trim() !== '') {
        whereCondition[Op.or] = [
            {
                username: { [Op.like]: searchString }
            },
            {
                email: { [Op.like]: searchString }
            }
        ];
    }

    const listQuery = {
        include: [
            { model: models.Roles, as: 'roles' }
        ],
        offset: +offsetRows,
        limit: +limitRows,
        where: whereCondition
    };

    if (options.orders != null && options.orders.length > 0) {
        listQuery.order = options.orders;
    }

    const cpListQuery = {
        where: listQuery.where
    };
    const countUser = models.Users.count(cpListQuery);
    const userCollection = models.Users.findAll(listQuery)
    
    return Promise.all([countUser, userCollection]).then(([count, collection]) => {
        collection = collection.map(user => {
            const dataCp = {...user.dataValues};
            dataCp.roles = dataCp.roles.map(role => ({id: role.id, role: role.role}));
            return dataCp;
        });
        return Promise.resolve({count, collection});
    });
};

module.exports = list;
