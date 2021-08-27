const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../models');

/**
 * function to list all the users
 * @param {number} offset offset of the row
 * @param {number} limit limit of the rows to be returned
 * @param {<Array>[]} orders list of arrays to be order by. eg [['username', 'asc'], ['email', 'asc']]
 * @param {string} searchString search value
 */
const list = function (offset, limit, orders, searchString) {
    const whereCondition = {
        deleted: false
    };
    const offsetRows = offset || 0;
    const limitRows = limit || 10;
    
    searchString = searchString.trim()+'%';
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

    if (orders != null && orders.length > 0) {
        listQuery.order = orders;
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
