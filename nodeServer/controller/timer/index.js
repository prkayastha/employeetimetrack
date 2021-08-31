const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const operations = {};

fs.readdirSync(__dirname)
.filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(file => {
    const ops = require('./'+file);
    const filename = file.split('.')[0];
    operations[filename] = ops;
})

module.exports = operations;