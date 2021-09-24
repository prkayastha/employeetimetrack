var express = require('express');
var router = express.Router();

const auth = require('../controller/authenticate');
const errorHandler = require('../controller/errorHandler');
const jwtDecoder = require('../utils/jwt-decode');

router.get('/checkValid', (req, res) => {
    const jwtPayload = jwtDecoder(req);

    res.send(jwtPayload);
});

/**
 * method: post
 * path: /auth/check
 * Route to check login of the user
 */
router.post('/check', function (req, res) {
    auth.checkUsernamePassword(req.body.username, req.body.password).then(token => {
        res.send(token);
    }).catch(error => {
        errorHandler(res, error);
    });
});

module.exports = router;
