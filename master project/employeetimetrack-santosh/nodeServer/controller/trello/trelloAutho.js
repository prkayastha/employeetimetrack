const OAuth = require('oauth').OAuth,
    appConfig = require('../../config/appConfig');

var trelloAuthUrls = module.exports.trelloAuthUrls = {
    requestURL: "https://trello.com/1/OAuthGetRequestToken",
    accessURL: "https://trello.com/1/OAuthGetAccessToken",
    authorizeURL: "https://trello.com/1/OAuthAuthorizeToken",
};

var getOAuthAccessToken = function (userId, token, tokenSecret, verifier) {
    oauth = new OAuth(trelloAuthUrls.requestURL,
        trelloAuthUrls.accessURL,
        appConfig.appkey,
        appConfig.appSecret,
        "1.0",
        `${appConfig.callbackUrl}/${userId}`, "HMAC-SHA1");
    var OAuthaccessTokenPromise = new Promise(function (resolve, reject) {
        oauth.getOAuthAccessToken(token, tokenSecret, verifier, function (error, accessToken, accessTokenSecret, results) {
            if (!error) {
                resolve({
                    'reqTokenSecret': tokenSecret,
                    'accessToken': accessToken,
                    'accessTokenSecret': accessTokenSecret
                });
            } else {
                reject({ 'error': error });
            }
        });
    });

    return OAuthaccessTokenPromise;
};

module.exports.getRequestToken = function (userId, callback) {
    oauth = new OAuth(trelloAuthUrls.requestURL,
        trelloAuthUrls.accessURL,
        appConfig.appkey,
        appConfig.appSecret,
        "1.0",
        `${appConfig.callbackUrl}/${userId}`, "HMAC-SHA1");
    oauth.getOAuthRequestToken(callback);
};

module.exports.getAccessToken = function (query) {
    var getAccessTokenPromise = new Promise(function (resolve, reject) {
        var token = query.oauth_token;
        var tokenSecret = query.tokenSecret;
        var verifier = query.oauth_verifier;
        getOAuthAccessToken(query.UserId, token, tokenSecret, verifier).then(function (result) {
            if (!result.error) {
                resolve(result)
            } else {
                reject(result);
            }
        });
    });

    return getAccessTokenPromise;
};