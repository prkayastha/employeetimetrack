const express = require('express'),
    router = express.Router();

const trelloAuth = require('../controller/trello/trelloAutho'),
    appConfig = require('../config/appConfig');

const trello = require('../controller/trello');
const ErrorResponse = require('../prototypes/responses/global.error');

router.post('/api/oauth/requestToken', (req, res) => {
    const userId = req.body.userId;
    var callback = function (error, token, tokenSecret, results) {
        if (!error) {
            //store to db and then send url
            const response = {
                code: 200,
                url: `${trelloAuth.trelloAuthUrls.authorizeURL}?oauth_token=${token}&name=${appConfig.appName}&expiration=never`
            }
            res.status(response.code).send(response);
        } else {
            //TODO: send login failure error message to be displayed to the user.
            const response = {
                code: error.code,
                url: `Cannot authenticate to trello`
            }
            res.send(response);
        }
    };

    trelloAuth.getRequestToken(userId, callback);
});

router.get('/oauth/callbackUrl/:userId', async (req, res) => {
    if (!isAccessDenied(req)) {

        const data = {
            ...req.query
        };

        try {
            let result = await trello.add(req.params.userId, data);
            if (!!result) {
                res.render('authSuccess');
            }
        } catch (error) {
            res.status(error.statusCode);
            res.send({message: error.message, statusCode: error.statusCode});
            res.end();
        }
    } else {
        error = new ErrorResponse('Cannot authenticate with trello');
        error.statusCode = 400;
        error.name = 'TrelloAuthInsertError';
        res.send(error);
        res.end();
    }
});

function isAccessDenied(req) {
    const query = req.query;

    if ("oauth_token" in query
        && "oauth_verifier" in query) {
        return false;
    }
    return true;
}

module.exports = router;

/* module.exports.getTrelloBoardsByUser = function (req, res) {
    db.getCachedTokenByAccessToken(req.body.accessToken).then(function (tokenInfo) {
        if (!tokenInfo.error) {
            trelloQuery.getUserTrelloBoards(tokenInfo).then(function (result) {
                if (!result.error) {
                    res.send(result);
                } else {
                    var error = {
                        errorStatus: true,
                        source: 'Trello board',
                        message: result.error.message.substring(1, 40)
                    };
                    res.send(error);
                }
            });
        } else {
            //TODO: handle error if no token info found
            res.send(tokenInfo.error);
        }

    });
};

module.exports.getTrelloBoardLists = function (req, res) {
    var boardListsPromise = new Promise(function (resolve, reject) {
        db.getCachedTokenByAccessToken(req.body.accessToken).then(function (tokenInfo) {
            if (!tokenInfo.error) {
                trelloQuery.getBoardLists({
                    'boardId': req.body.boardId,
                    'tokenInfo': tokenInfo
                }).then(function (result) {
                    if (!result.error) {
                        res.send(result);
                    } else {
                        var error = {
                            errorStatus: true,
                            source: 'Trello board list',
                            message: result.error.message.substring(1, 40)
                        };
                        res.send(error);
                    }
                });
            } else {
                //TODO: handle case where accessToken may have been tempered with at fron end.
                res.send(tokenInfo.error);
            }
        });
    });
};

module.exports.getCardsInList = function (req, res) {
    db.getCachedTokenByAccessToken(req.body.accessToken).then(function (tokenInfo) {
        if (!tokenInfo.error) {
            trelloQuery.getCardsOnList({
                'listId': req.body.listId,
                'tokenInfo': tokenInfo
            }).then(function (result) {
                if (!result.error) {
                    res.send(result)
                } else {
                    var error = {
                        errorStatus: true,
                        source: 'Trello card',
                        message: result.error.message.substring(1, 40)
                    };
                    res.send(error);
                }
            });
        } else {
            res.send(tokenInfo.error);
        }
    });
} */