const models = require('../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

module.exports = async function (operatorInfo, options) {
    const listQuery = {};
    listQuery.offset = options.offset || 0;
    listQuery.limit = options.limit || 10;
    listQuery.where = {
        isDelete: false,
        [Op.or]: [
            { createdByUserId: operatorInfo.id },
            { projectOwnerUserId: operatorInfo.id }
        ]
    };
    listQuery.order = [[options.sortBy || 'id', options.order || 'ASC']]

    if (!!options.search) {
        listQuery.where['projectName'] = { [Op.like]: options.search.trim() + '%' }
    }

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
    listQuery.attributes = ['id', 'projectName']

    let list = await models.Project.findAll(listQuery);
    return list;
}