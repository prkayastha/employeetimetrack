const models = require('../../models');

module.exports = async function (shotInfo) {

    const info = {};
    info['unproductive'] = false;
    info['location'] = shotInfo.url;
    info['taskId'] = +shotInfo.taskId;

    const result = await models.Screenshot.create(info);
    return result;
}