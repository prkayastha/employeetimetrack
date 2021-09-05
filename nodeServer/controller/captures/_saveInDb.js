const models = require('../../models');

module.exports = async function (shotInfo, userId) {

    const info = {};
    info['unproductive'] = false;
    info['location'] = shotInfo.url;
    info['TaskId'] = +shotInfo.taskId;
    info['assigneeUserId'] = +userId;

    const result = await models.Screenshot.create(info);
    return result;
}