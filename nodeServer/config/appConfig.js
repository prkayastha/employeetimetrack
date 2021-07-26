
module.exports = {
    appName: "Employee Time Tracking App",
    appkey: process.env.employeeTrackKey,
    appSecret: process.env.employeeTrackSecret,
    callbackUrl: "http://localhost:3000/trello/oauth/callbackUrl"
};