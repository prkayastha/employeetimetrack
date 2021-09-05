var express = require('express');
var router = express.Router();

const env = process.env.NODE_ENV || 'development';
const settings = require(__dirname + '/../config/settings.json')[env];

const jwtDecoder = require('../utils/jwt-decode');
const userOperation = require('../controller/user');
const User = require('../prototypes/users/users');

const errorHandler = require('../controller/errorHandler');

const userValidator = require('../validators/user');
const { validationResult } = require('express-validator');
const { allow, ROLES } = require('../controller/authorize');

router.post('/register',
  userValidator.register,
  async (req, res) => {
    const reqValidation = validationResult(req);

    if (!reqValidation.isEmpty()) {
      return errorHandler(res, { errors: reqValidation.array(), name: 'InvalidRequest' })
    }

    const passwordString = req.body.password || 'test';
    const user = new User();
    user.setData(req.body, settings.seperateUsername);
    user.active = true;
    user.roles = [{ id: 3 }];
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
router.put('/update/:userId',
  allow([ROLES.ADMIN, ROLES.MANAGER]),
  function (req, res) {
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
router.delete('/delete/:userId',
  allow([ROLES.ADMIN]),
  function (req, res) {
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
router.post('/list',
  allow([ROLES.ADMIN, ROLES.MANAGER]),
  function (req, res) {
    const jwtPayload = jwtDecoder(req);

    const offset = req.body.offset || 0;
    const limit = req.body.limit || 10;
    const order = [[
      req.body.orderBy,
      req.body.order
    ]];
    const searchQuery = req.body.search || '';
    const options = {
      offset,
      limit,
      orders: order,
      searchQuery
    };

    userOperation.list(options, jwtPayload).then(users => {
      res.send(users);
    }).catch(error => {
      errorHandler(res, error);
    });
  });

router.get('/getAllManager',
  allow([ROLES.ADMIN, ROLES.MANAGER]),
  async (req, res) => {
    try {
      const list = await userOperation.listUserByRole(2);
      res.status(200).send(list);
    } catch (error) {
      errorHandler(res, error);
    }
  });

/* get users by id */
router.get('/:userId',
  function (req, res) {
    const userId = req.params.userId;

    const jwtPayload = jwtDecoder(req);

    userOperation.get(userId, jwtPayload).then(userResponse => {
      res.send(userResponse);
    }).catch(error => {
      errorHandler(res, error);
    });
  });

module.exports = router;
