var express = require('express');
var router = express.Router();

const env = process.env.NODE_ENV || 'development';
const settings = require(__dirname + '/../config/settings.json')[env];

const jwtDecoder = require('../utils/jwt-decode');
const userOperation = require('../controller/user');
const User = require('../prototypes/users/users');

const errorHandler = require('../controller/errorHandler');

const userValidator = require('../validators/user');
const {validationResult} = require('express-validator');

router.post('/register',
  userValidator.register,
  async (req, res) => {
    /* const passwordString = req.body.password || 'test';
    const user = new User();
    user.setData(req.body, settings.seperateUsername);
    userOperation.add(user, passwordString).then(userResponse => {
      res.send(userResponse);
    }).catch(error => {
      errorHandler(res, error);
    }); */
    const reqValidation = validationResult(req);

    if (!reqValidation.isEmpty()) {
      return errorHandler(res, {errors: reqValidation.array(), name: 'InvalidRequest'})
    }

    const passwordString = req.body.password || 'test';
    const user = new User();
    user.setData(req.body, settings.seperateUsername);
    user.active = true;
    user.Roles = [{ id: 3 }];
    try {
      addedUser = await userOperation.add(user, passwordString);
      res.send(addedUser);
    } catch (error) {
      errorHandler(res, error);
    }
  });

/* Post user information */
router.post('/add', function (req, res) {
  const passwordString = req.body.password || 'test';
  const user = new User();
  user.setData(req.body, settings.seperateUsername);
  userOperation.add(user, passwordString).then(userResponse => {
    res.send(userResponse);
  }).catch(error => {
    errorHandler(res, error);
  });
});

/* update user information */
router.put('/update/:userId', function (req, res) {
  const userId = req.params.userId;
  const user = new User();
  user.setData(req.body, settings.seperateUsername);

  const payload = jwtDecoder(req);

  userOperation.update(payload, userId, user).then(userResponse => {
    res.send(userResponse);
  }).catch(error => {
    errorHandler(res, error);
  });
});

/* Delete user by Id */
router.delete('/delete/:userId', function (req, res) {
  const userId = req.params.userId;
  userOperation.deleteUser(userId).then(userResponse => {
    res.send(userResponse);
  }).catch(error => {
    errorHandler(res, error);
  });
});

/* Activate user */
router.get('/activate/:hash', function (req, res) {
  const hashString = req.params.hash;
  const userEmail = req.query.email;

  userOperation.activate(hashString, userEmail).then(activationResponse => {
    res.send(activationResponse);
  }).catch(error => {
    errorHandler(res, error);
  });
});

/* list all the users */
router.post('/list', function (req, res) {
  const offset = req.body.offset || 0;
  const limit = req.body.limit || 10;
  const order = [[
    req.body.orderBy,
    req.body.order
  ]];
  const searchQuery = req.body.search || '';

  userOperation.list(offset, limit, order, searchQuery).then(users => {
    res.send(users);
  }).catch(error => {
    errorHandler(res, error);
  });
});

/* get users by id */
router.get('/:userId', function (req, res) {
  const userId = req.params.userId;
  userOperation.get(userId).then(userResponse => {
    res.send(userResponse);
  }).catch(error => {
    errorHandler(res, error);
  });
});

module.exports = router;
