const models = require('../../models');

module.exports = async function(userId) {
    const trello = await models.TrelloAuths.findOne({ where: { UserId: userId } });

    if (!trello || !trello.accessToken || !trello.accessTokenSecret) {
        return false;
    }

    return true;
}