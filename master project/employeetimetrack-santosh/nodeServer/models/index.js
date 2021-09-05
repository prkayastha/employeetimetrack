'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const mysqlconnect = require('../dbconnet/mysqlconnect');
// var redisServer = require('../dbconnet/redisserver');
const cache = require('../dbconnet/nodeCache');
const db = {};

const sequelize = mysqlconnect;

fs
.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.cache = cache;

db.sync = function() {
  console.log('Syncing DB');
  return sequelize.sync();
}

module.exports = db;
