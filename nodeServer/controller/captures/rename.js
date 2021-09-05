const fs = require('fs'),
    path = require('path'),
    env = process.env.NODE_ENV || 'development',
    settings = require('../../config/settings.json')[env];

const SuccessResponse = require('../../prototypes/responses/global.success');
const saveInDb = require('./_saveInDb');

module.exports = async function (req, userInfo) {
    const pathName = path.join(__dirname, '../../public/captures');
    const fileExt = req.file.originalname.split('.')[1];
    const oldPath = path.join(pathName, req.file.filename);
    const newPath = `${oldPath}.${fileExt}`;

    await fs.renameSync(oldPath, newPath);
    const url = `${settings.apiURL}/capture/${req.file.filename}.${fileExt}`;

    const response = SuccessResponse.getSuccessResponse(200, 'Screenshot uploaded with url '+url)
    response['url'] = url;
    response['taskId'] = req.body.taskId;

    const result = saveInDb(response, userInfo.id);

    return result;
}
