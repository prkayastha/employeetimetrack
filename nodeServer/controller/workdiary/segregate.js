const models = require('../../models');
const stringRes = require('../../resources/string/resources');
const SuccessResponse = require('../../prototypes/responses/global.success');

module.exports = async function (screenshotInfo) {
    const result = await models.Screenshot.update({ unproductive: screenshotInfo.unproductive }, {
        where: { id: screenshotInfo.id }
    });

    const response = SuccessResponse.getSuccessResponse(
        200,
        stringRes.screenshot.updateScreenshot
    );

    return response;
}