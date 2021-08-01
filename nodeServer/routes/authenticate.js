var express = require('express');
var router = express.Router();

const auth = require('../controller/authenticate');
const errorHandler = require('../controller/errorHandler');

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
