'use strict';

var express = require('express');
var router = express.Router();

const env = process.env.NODE_ENV || 'development';
const settings = require('../config/settings.json')[env];

const jwt = require('jsonwebtoken');
const userOperation = require('../controller/user');
const passwordreset = require('../controller/authenticate/index');
const ChangePassword = require('../prototypes/password/changePassword');

const errorHandler = require('../controller/errorHandler');

/**
 * Method: Post
 * Path: /password/change
 * Route to change the password either by reset link or normal change of password
 */
router.post('/change', function(req, res){

    const link = req.body.reset;
    const changePassword = new ChangePassword(req.body);

    if (link == undefined) {
        new Promise((resolve, reject) => {
            try {
                let token = req.get('Authorization');
                if (token == undefined) {
                    const error = new Error('No authorization token found');
                    error.name = 'UnauthorizedError';
                    reject(error);
                }
                token = token.split(' ')[1];
                const auth = jwt.verify(token, settings.tokenSecret);
                resolve(auth);
            } catch (error) {
                error.name = 'UnauthorizedError';
                reject(error);
            }
        }).then(user => {
            return passwordreset.checkUsernamePasswordOnly(user.username, changePassword.oldPassword)
        }).then(result => {
            return userOperation.changePassword(changePassword)
        }).then(response => {
            res.send(response);
        }).catch(error => {
            errorHandler(res, error);
        });
    } else {
        // reset password with link
        passwordreset.reset.checkLink(link).then((result) => {
            changePassword.id = result.userId;
            return userOperation.changePassword(changePassword)
        }).then(response => {
            res.send(response);
        }).catch(error => {
            errorHandler(res,error);
        });
    }
    
});

router.post('/reset', function(req, res){
    const username = req.body.username;

    userOperation.getByUsername(username).then(user => {
        return passwordreset.reset.generateLinkLim(user.id);
    }).then((linkResponse) => {
        res.send(linkResponse);
    }).catch(error => {
        errorHandler(res, error);
    });
});

module.exports = router;