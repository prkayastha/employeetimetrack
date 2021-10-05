const env = process.env.NODE_ENV || 'development'
const settings = require('./settings.json')[env];
module.exports = {
    appName: "Employee Time Tracking App",
    appkey: process.env.employeeTrackKey,
    appSecret: process.env.employeeTrackSecret,
    callbackUrl: `${settings.apiURL}/trello/oauth/callbackUrl`,
    mailerSetting: {
        type: "OAuth2",
        user: "94prajesh@gmail.com",
        clientId: process.env.GMAILCLIENTID,
        clientSecret: process.env.GMAILCLIENTSECRET,
        refreshToken: process.env.GMAILREFRESHTOKEN,
        accessToken: process.env.GMAILACCESSTOKEN
    }
};