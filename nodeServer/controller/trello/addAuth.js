const models = require('../../models');
const ErrorResponse = require('../../prototypes/responses/global.error');

const add = async function (userId, auth) {
    const row = {
        UserId: userId,
        authenticationkey: auth.oauth_token,
        verificationKey: auth.oauth_verifier,
        tokenSecret: auth.tokenSecret,
        accessToken: auth.accessToken,
        accessTokenSecret: auth.accessTokenSecret
    };

    try {
        const userAuth = await models.TrelloAuths.findOne({ where: { UserId: userId } });
        if (!!userAuth) {
            const insert = await models.TrelloAuths.update(row, {
                where: {UserId: userId}
            });
            return insert;
        } else {
            const insert = await models.TrelloAuths.create(row);
            return insert;
        }
    } catch (error) {
        error = new ErrorResponse('Cannot insert Trello Auth');
        error.statusCode = 400;
        error.name = 'TrelloAuthInsertError';
        throw error;
    }
}

module.exports = add;
