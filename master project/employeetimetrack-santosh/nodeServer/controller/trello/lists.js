const trelloQuery = new (require('./Query'));
const models = require('../../models');

const list = async function (userId, boardId) {
    const userAuth = await models.TrelloAuths.findOne({ where: { UserId: userId } });
    if (!userAuth) {
        throw Error('Cannot find authenticationKey');
    }
    const boardIdandtokenPair = {
        boardId,
        tokenInfo: {
            accToken: userAuth.accessToken,
            accTokenSecret: userAuth.accessTokenSecret
        }
    };
    const boards = await trelloQuery.getBoardLists(boardIdandtokenPair);
    return boards;
}

module.exports = list;