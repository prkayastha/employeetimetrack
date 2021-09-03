const models = require('../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

const userOperation = require('../user');

module.exports = async function (operatorInfo, options) {
    const operatorRole = await userOperation.getUserRoleById(operatorInfo.id);

    const listQuery = {};
    listQuery.offset = options.offset || 0;
    listQuery.limit = options.limit || 10;

    let list = null;
    let count = null;

    if (operatorRole.roleId == 2 || operatorRole.roleId == 1) { //manager role

        listQuery.where = { isDelete: false };

        listQuery.order = [[options.sortBy || 'id', options.order || 'ASC']]

        if (!!options.search) { listQuery.where['projectName'] = { [Op.like]: options.search.trim() + '%' } }

        listQuery.include = [
            {
                model: models.Users,
                as: 'createdBy',
                attributes: ['firstname', 'lastname']
            },
            {
                model: models.Users,
                as: 'projectOwner',
                attributes: ['firstname', 'lastname']
            }
        ];

        listQuery.attributes = ['id', 'projectName'];

        if (operatorRole.roleId == 2) {
            listQuery.where[Op.or] = [
                { createdByUserId: operatorInfo.id },
                { projectOwnerUserId: operatorInfo.id }
            ];
        }

        list = models.Project.findAll(listQuery);

        const cpListQuery = {
            where: listQuery.where
        }

        count = models.Project.count(cpListQuery);

    } else {

        listQuery.where = { UserId: operatorInfo.id };
        listQuery.include = [
            {
                model: models.Project,
                include: [
                    {
                        model: models.Users,
                        as: 'createdBy',
                        attributes: ['firstname', 'lastname']
                    },
                    {
                        model: models.Users,
                        as: 'projectOwner',
                        attributes: ['firstname', 'lastname']
                    }
                ],
                attributes: ['id', 'projectName'],
                where: { isDelete: false }
            }
        ];
        if (!!options.search) { listQuery.include[0].where['projectName'] = { [Op.like]: options.search.trim() + '%' } }
        listQuery['order'] = [[{ model: models.Project }, options.sortBy || 'id', options.order || 'ASC']];
        list = models.UserProject.findAll(listQuery);

        const cpListQuery = {...listQuery};

        count = models.UserProject.count(cpListQuery);
    }



    const [resultCount, resultList] = await Promise.all([count, list])
    return { count: resultCount, collection: resultList };
}