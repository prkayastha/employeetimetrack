
module.exports = {
    appName: "Employee Time Tracking App",
    appkey: process.env.employeeTrackKey,
    appSecret: process.env.employeeTrackSecret,
    callbackUrl: "http://localhost:3000/trello/oauth/callbackUrl",
    mailerSetting: {
        type: "OAuth2",
        user: "94prajesh@gmail.com",
        clientId: process.env.GMAILCLIENTID,
        clientSecret: process.env.GMAILCLIENTSECRET,
        refreshToken: process.env.GMAILREFRESHTOKEN,
        accessToken: process.env.GMAILACCESSTOKEN
    }
};