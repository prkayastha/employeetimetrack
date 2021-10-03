const models = require('../../models');

module.exports = async function(userId) {
    const trello = await models.TrelloAuths.findOne({ where: { UserId: userId } });

    if (!trello) {
        return false;
    }

    return true;
}