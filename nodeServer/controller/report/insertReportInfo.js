const models = require('../../models');

module.exports = async function(fileName, userId) {
    const result = await models.Report.bulkCreate([{location: fileName, userId}], {ignoreDuplicates: true});
    return result;
}