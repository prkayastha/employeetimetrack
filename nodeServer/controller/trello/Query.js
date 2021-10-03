/* importing another module: trelloAuth */
const OAuth = require('oauth').OAuth,
    appConfig = require('../../config/appConfig');
const trelloAuthUrls = require('./trelloAutho').trelloAuthUrls;
const oauth = new OAuth(trelloAuthUrls.requestURL,
    trelloAuthUrls.accessURL,
    appConfig.appkey,
    appConfig.appSecret,
    "1.0",
    `${appConfig.callbackUrl}`, "HMAC-SHA1");

var Query = module.exports = function () {
    this.uri = "https://api.trello.com";
};

Query.prototype.getUserInfo = function (tokenkeyPair) {
    var self = this;
    var userInfoPromise = new Promise(function (resolve, reject) {
        oauth.get(
            /* api to get a user's info: https://api.trello.com/1/members/me */
            `${self.uri}/1/members/me`,
            tokenkeyPair.accessToken,
            tokenkeyPair.accessTokenSecret,
            function (error, data, response) {
                if (!error) {
                    resolve(data);
                } else {
                    reject(error);
                }
            });
    });

    return userInfoPromise;
};

Query.prototype.getUserTrelloBoards = function (tokenInfo) {
    var self = this;
    var userBoardsPromise = new Promise(function (resolve, reject) {
        oauth.get(
            /*api to get a user's boards https://api.trello.com/1/members/me/boards*/
            `${self.uri}/1/members/me/boards?fields=name,url,id`,
            tokenInfo.accToken,
            tokenInfo.accTokenSecret,
            function (err, data, response) {
                if (!err) {
                    resolve(data);
                } else {
                    reject({ 'error': err });
                }
            }
        );
    });

    return userBoardsPromise;
};

Query.prototype.getBoardLists = function (boardIdAndTokenInfo) {
    var self = this;
    var boardlistsPromise = new Promise(function (resolve, reject) {
        oauth.get(
            /*api to gets lists in a given board of a particular user:
            https://api.trello.com/1/boards/<boardId>/lists */
            `${self.uri}/1/boards/${boardIdAndTokenInfo.boardId}/lists?fields=name,id`,
            boardIdAndTokenInfo.tokenInfo.accToken,
            boardIdAndTokenInfo.tokenInfo.accTokenSecret,
            function (err, data, response) {
                if (!err) {
                    resolve(data);
                } else {
                    reject({ 'error': err });
                }
            }
        );
    });

    return boardlistsPromise;
};

Query.prototype.getCardsOnBoard = function (boardListAndTokenInfo) {
    var self = this;
    var cardsOnListPromise = new Promise(function (resolve, reject) {
        oauth.get(
            /*api to gets cards in a given list, in a given board of a particular user: https://api.trello.com/1/lists/<listId>/cards */
            `${self.uri}/1/board/${boardListAndTokenInfo.id}/cards/open?fields=name,id`,
            boardListAndTokenInfo.tokenInfo.accToken,
            boardListAndTokenInfo.tokenInfo.accTokenSecret,
            function (err, data, response) {
                if (!err) {
                    resolve(data);
                } else {
                    reject({ 'error': err });
                }
            }
        );
    });
    return cardsOnListPromise;
};

Query.prototype.getBoardInfo = function(tokenInfo, boardId) {
    var self = this;
    var boardPromise = new Promise((resolve, reject) => {
        oauth.get(
            /*api to gets cards in a given list, in a given board of a particular user: https://api.trello.com/1/lists/<listId>/cards */
            `${self.uri}/1/boards/${boardId}?fields=name,id`,
            tokenInfo.accToken,
            tokenInfo.accTokenSecret,
            function (err, data, response) {
                if (err) {
                    return reject({ 'error': err });
                }
                return resolve(data);
            }
        );
    });
    return boardPromise;
}