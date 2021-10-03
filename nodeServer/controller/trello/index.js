const add = require('./addAuth');
const getTokenSecret = require('./getTokenSecret');
const getBoard = require('./getBoard');
const getList = require('./lists');
const checkConnection = require('./checkTrelloConnection');
const importProject = require('./importProject');

module.exports = {
    add,
    getTokenSecret,
    getBoard,
    getList,
    checkConnection,
    importProject
}