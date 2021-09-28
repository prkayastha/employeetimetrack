const cron = require('node-cron');
const report = require('../controller/report');

cron.schedule('0 0 * * 1', () => {
    console.log('===================================================================');
    console.log('Generating Report');
    console.log('===================================================================');
    report.generateReport();
}, {
    scheduled: true,
    timezone: "Australia/Adelaide"
});