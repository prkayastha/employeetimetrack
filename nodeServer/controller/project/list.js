const models = require('../../models');

module.exports = async function(options) {
    let list = await models.Project.findAll();
    return list;
}