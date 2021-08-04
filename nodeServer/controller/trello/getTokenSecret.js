const models = require('../../models');

const getTokenSecret = async function(userId) {
    const secret = await models.TrelloAuths.findOne({
        where: { UserId: userId }
    });
    return secret;
}

module.exports = getTokenSecret;