const express = require('express'),
    router = express.Router(),
    trelloAuth = require('../controller/trello/trelloAutho'),
    appConfig = require('../config/appConfig');

const trello = require('../controller/trello');
const ErrorResponse = require('../prototypes/responses/global.error');

const authHelper = require('../controller/authenticate/token');
router.post('/api/oauth/requestToken', async (req, res) => {
    const userId = req.body.userId;
    var callback = async function (error, token, tokenSecret, results) {
        if (!error) {
            //store to db and then send url
            const auth = {
                oauth_token: token,
                verificationkey: null,
                tokenSecret,
                accessToken: null,
                accessTokenSecret: null
            };
            const result = await trello.add(userId, auth);
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
        try {
            const secret = await trello.getTokenSecret(req.params.userId);
            const data = {
                ...req.query,
                tokenSecret: secret.tokenSecret,
                UserId: req.params.userId
            };
            let result = await trello.add(req.params.userId, data);
            let accessToken = await trelloAuth.getAccessToken(data);
            if (!!accessToken) {
                const auth = {
                    accessToken: accessToken.accessToken,
                    accessTokenSecret: accessToken.accessTokenSecret
                };
                result = await trello.add(req.params.userId, auth);
                res.render('authSuccess');
            }
        } catch (error) {
            res.status(error.statusCode);
            res.send({ message: error.message, statusCode: error.statusCode });
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

router.get('/api/getboards', async (req, res) => {
    const jwtToken = req.headers.authorization.split(" ")[1];
    const data = authHelper.data(jwtToken);
    try {
        let result = await trello.getBoard(data.id);
        const response = {
            collection: JSON.parse(result)
        }
        res.send(response);
    } catch (error) {
        res.send(error)
    }
});

router.post('/api/board/list', async (req, res) => {
    const jwtToken = req.headers.authorization.split(" ")[1];
    const data = authHelper.data(jwtToken);
    try {
        const boardId = req.body.id;
        let result = await trello.getList(data.id, boardId);
        const response = {
            collection: JSON.parse(result)
        }
        res.send(response);
    } catch (error) {
        res.send(error)
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