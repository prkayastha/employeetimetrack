const models = require('../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

const userOperation = require('../user');

module.exports = async function (operatorInfo, options, includeNested = true) {
    const operatorRole = await userOperation.getUserRoleById(operatorInfo.id);

    const listQuery = {};
    listQuery.offset = options.offset || 0;
    listQuery.limit = options.limit || 10;

    let list = null;
    let count = null;

    if (operatorRole.id == 2 || operatorRole.id == 1) { //manager role

        listQuery.where = { isDelete: false };

        listQuery.order = [[options.sortBy || 'id', options.order || 'ASC']]

        if (!!options.search) { listQuery.where['projectName'] = { [Op.like]: options.search.trim() + '%' } }

        if (includeNested) {
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
        }

        listQuery.attributes = ['id', 'projectName', [models.sequelize.fn('taskCount', models.sequelize.col('Project`.`id')), 'taskCount']];

        if (operatorRole.id == 2) {
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

    } else { //employee role

        listQuery.where = { UserId: operatorInfo.id };
        listQuery.include = [
            {
                model: models.Project,
                attributes: ['id', 'projectName', [models.sequelize.fn('taskCount', models.sequelize.col('Project`.`id')), 'taskCount']],
                where: { isDelete: false }
            }
        ];
        if (includeNested) {
            listQuery.include[0].include = [
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
        }
        if (!!options.search) { listQuery.include[0].where['projectName'] = { [Op.like]: options.search.trim() + '%' } }
        listQuery['order'] = [[{ model: models.Project }, options.sortBy || 'id', options.order || 'ASC']];
        list = models.UserProject.findAll(listQuery);

        const cpListQuery = { ...listQuery };

        count = models.UserProject.count(cpListQuery);
    }

    let [resultCount, resultList] = await Promise.all([count, list]);

    if (operatorRole.id == 3) {
        resultList = resultList.map(result => result.Project);
    }

    return { count: resultCount, collection: resultList };
}