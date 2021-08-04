const models = require('../../models');
const trelloQuery = new(require('./Query'));
const trelloAuth = require('./trelloAutho');

const getBoard = async function (userId) {
    const userAuth = await models.TrelloAuths.findOne({ where: { UserId: userId } });
    if (!userAuth) {
       throw Error('Cannot find authenticationKey');
    }
    let accessToken = await trelloAuth.getAccessToken(userAuth);
    return accessToken
}

module.exports = getBoard;