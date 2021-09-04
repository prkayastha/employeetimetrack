const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const operations = {};

const multer = require('multer');

const upload = multer({
    dest:  path.join(__dirname, '../../public/captures'),
    limits: { fileSize: 5 * 1024 * 1024 }
});

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    }).forEach(file => {
        const ops = require('./' + file);
        const filename = file.split('.')[0];
        operations[filename] = ops;
    });

operations['multer'] = multer;
operations['upload'] = upload;

module.exports = operations;