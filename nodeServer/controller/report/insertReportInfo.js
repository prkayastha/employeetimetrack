const models = require('../../models');

module.exports = async function(fileName, userId) {
    const result = await models.Report.bulkCreate([{fileName, userId}], { updateOnDuplicate: ['updateAt']});
    return result;
}