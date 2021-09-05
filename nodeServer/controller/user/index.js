const add = require('./add');
const activate = require('./activate');
const deleteUser = require('./delete');
const list = require('./list');
const get = require('./get-user');
const update = require('./update');
const changePassword = require('../authenticate/changePassword');
const getByUsername = require('./get-user-username');
const getUserRole = require('./getUserRole');
const listUserByRole = require('./listUserWithRole');

module.exports = {
    add,
    activate,
    deleteUser,
    list,
    get,
    update,
    changePassword,
    getByUsername,
    getUserRoleById: getUserRole,
    listUserByRole
};
