const models = require('../../models');
const trelloQuery = new(require('./Query'));

const getBoard = async function (userId) {
    const userAuth = await models.TrelloAuths.findOne({ where: { UserId: userId } });
    if (!userAuth) {
       throw Error('Cannot find authenticationKey');
    }
    const tokenPair = {
        accToken: userAuth.accessToken,
        accTokenSecret: userAuth.accessTokenSecret
    };
    const boards = await trelloQuery.getUserTrelloBoards(tokenPair);
    return boards;
}

module.exports = getBoard;