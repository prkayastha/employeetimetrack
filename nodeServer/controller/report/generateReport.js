const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const moment = require('moment');
const getReport = require('./getReport');
const instertIntoDB = require('./insertReportInfo');
const user = require('../../controller/user');
const breaks = require('../dashboard/getBreaks');
const activity = require('./getActivity');

const average = (list) => list.reduce((prev, curr) => prev + curr) / list.length;

module.exports = async function () {
    const employees = await user.listUserByRole(3);

    for (let i = 0; i < employees.length; i++) {
        await generateReportByUserId(employees[i]['id']);
    }

    console.log('Report Generation Completed');
}

async function generateReportByUserId(userId) {

    const userInformation = await getUserById(userId);
    const reportInfo = await getReport(userId, true);
    const breakInfo = await breaks(userId, true);
    const activityLog = await activity(userId);

    const doc = new PDFDocument({
        size: 'A4',
        margin: 50
    });

    const dates = getDates();
    const headerInformation = {
        ...dates,
        fullName: `${userInformation['firstname']} ${userInformation['lastname']}`
    };
    const fileName = `${headerInformation.fullName.replace(/\s+/g, '-')}-${dates.year}-${dates.month}-Week-${dates.weekNo}.pdf`;
    const writeStream = fs.createWriteStream(`./public/reports/${fileName}`);

    writeStream.on('finish', async function() {
        await instertIntoDB(this.fileName, this.userId);
    }.bind({
        fileName,
        userId
    }));

    doc.pipe(writeStream);

    generateHeader(doc, headerInformation);

    setTableHeader(doc, 180);

    setTableRow(doc, reportInfo, breakInfo)

    doc.font('Helvetica-Bold');

    doc.moveDown();
    doc.moveDown();
    doc.text('Activity Log', 80, doc.y);
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();

    setActivityTableHeader(doc, doc.y);

    setActivityTableRows(doc, activityLog);

    doc.end();

}

function generateHeader(doc, headerInfo) {
    doc.fontSize(14);
    doc.font('Helvetica-Bold').text(
        'Weekly Employee Report', 0, 60, { width: 600, align: 'center' }
    );

    doc.moveDown();
    doc.fontSize(9);
    doc.font('Helvetica-Bold').text(`Date From`, {
        width: 510,
        align: 'right'
    });
    doc.font('Helvetica').text(`${headerInfo['startDate']}`, {
        width: 510,
        align: 'right'
    })

    doc.moveDown();
    doc.font('Helvetica-Bold').text(`Date To`, {
        width: 510,
        align: 'right'
    });
    doc.font('Helvetica').text(`${headerInfo['endDate']}`, {
        width: 510,
        align: 'right'
    })

    doc.moveDown();
    doc.font('Helvetica-Bold').text('Report For', 80, 90, {
        width: 510,
        align: 'left'
    })
    doc.font('Helvetica').text(`${headerInfo['fullName']}`, {
        width: 510,
        align: 'left'
    });
}

function setTableHeader(doc, y) {
    doc.font('Helvetica-Bold');
    doc.text('Project Name', 80, y, { width: 150 });
    doc.text('Time Spent', 230, y, { width: 100 });
    doc.text('Productive Screen', 310, y, {width: 50});
    doc.text('Unproductive Screen', 380, y, {width: 60});
    doc.text('Productivity', 460, y, {width: 60});
    doc.lineWidth(1);
    doc.lineCap('butt')
        .moveTo(80, y + 30)
        .lineTo(510, y + 30)
        .stroke();
}

function setTableRow(doc, information, breakInfo) {
    doc.font('Helvetica');
    let totalTime = 0;
    let totalProductiveScreen = 0;
    let totalUnproductiveScreen = 0;
    let productive = [];
    doc.moveDown(); doc.moveDown();
    for (let i = 0; i < information.length; i++) {
        doc.moveDown(); doc.moveDown();
        const row = information[i];
        totalTime = totalTime + timeToSec(row.timeForProject);
        totalProductiveScreen = totalProductiveScreen + (row.totalScreen - row.unproductive);
        totalUnproductiveScreen = totalUnproductiveScreen + row.unproductive;
        if (row.totalScreen > 0) {
            productive.push(row.unproductive / row.totalScreen)
        }
        let rowLine = doc.y;
        if ((rowLine + 20) > 750) {
            doc.addPage({size: 'A4', margin:80});
            rowLine = doc.y
        }
        doc.text(trimStr(row.projectName, 40), 80, rowLine, { width: 150 });
        doc.text(row.timeForProject, 230, rowLine, { width: 100 });
        doc.text(row.totalScreen - row.unproductive, 310, rowLine);
        doc.text(row.unproductive, 380, rowLine);
        doc.text(row.totalScreen == 0 ? 'N/A' : 1 - roundOff((row.unproductive / row.totalScreen)), 460, rowLine);
        doc.moveDown(); doc.moveDown();
        rowLine = doc.y;
        doc.lineWidth(0.5);
        doc.lineCap('butt')
            .moveTo(80, rowLine)
            .lineTo(510, rowLine)
            .stroke();
    }

    if (!information || !information.length) {
        doc.text(`No Records found for the week`, 60, doc.y + 50, { width: 510, align: 'center' });
        doc.lineWidth(0.5);
        doc.lineCap('butt')
            .moveTo(80, doc.y + 20)
            .lineTo(510, doc.y + 20)
            .stroke();
    }

    totalTime = secToTime(totalTime);
    let averageProd = 0;
    try {
        if (!!productive && !!productive.length) averageProd = average(productive);
    } catch (error) {
        console.log(error)
    }
    doc.moveUp(2);
    doc.text(`Total Time Recorded: ${totalTime}`, 80, doc.y + 50, { width: 510, align: 'left' });
    doc.text(`Total Breaks This Week: ${breakInfo.weekly}`, 80, doc.y, { width: 510, align: 'left' });
    doc.text(`Total Recorded Productive Screens: ${totalProductiveScreen}`, 80, doc.y, { width: 510, align: 'left' });
    doc.text(`Total Recorded Unproductive Screens: ${totalUnproductiveScreen}`, 80, doc.y, { width: 510, align: 'left' });
    const rate = roundOff(1 - averageProd)
    doc.text(`Total Productive Rate: ${rate * 100}%`, 80, doc.y, { width: 510, align: 'left' });
    doc.moveDown(2);
    doc.font('Helvetica-Bold').fillColor('#000', 0.4)
    doc.text('NOTE: Productivity = Productive Screen / Total Screen * 100').fillColor('#000', 1)
}

function setActivityTableHeader(doc, y) {
    doc.font('Helvetica-Bold');
    doc.text('Task Description', 80, y, { width: 150 });
    doc.text('Project Name', 210, y, { width: 100 });
    doc.text('Started At', 310, y);
    doc.text('Ended At', 380, y);
    doc.text('Duration', 460, y);
    doc.moveDown();
    const rowLine = doc.y;
    doc.lineWidth(1);
    doc.lineCap('butt')
        .moveTo(80, rowLine)
        .lineTo(510, rowLine)
        .stroke();
}

function setActivityTableRows(doc, information) {
    doc.font('Helvetica');
    for (let i = 0; i < information.length; i++) {
        const row = information[i];
        doc.moveDown();doc.moveDown();
        let lineCor = doc.y;
        if ((lineCor + 20) > 750) {
            doc.addPage({size: 'A4', margin:80});
            lineCor = doc.y
        }
        const startedAtDate = moment(row.startedAt).format('YYYY-MM-DD HH:mm:ss Z');
        const endedAtDate = moment(row.endedAt).format('YYYY-MM-DD HH:mm:ss Z');
        doc.text(trimStr(row.taskDescription, 50), 80, lineCor, { width: 145 });
        doc.text(trimStr(row.projectName, 25), 210,lineCor , { width: 95 });
        doc.text(startedAtDate, 310, lineCor, {width: 50});
        doc.text(endedAtDate, 380, lineCor, {width: 50});
        doc.text(row.duration, 460, lineCor);
        doc.lineWidth(0.5);
        doc.moveDown();doc.moveDown();doc.moveDown();doc.moveDown();
        lineCor = doc.y;
        doc.lineCap('butt')
            .moveTo(80, lineCor)
            .lineTo(510, lineCor)
            .stroke();
    }
}

function getDates() {
    const formatDate = 'DD/MM/YYYY'
    const today = moment();
    const weekNo = weekOfMonth(today.clone().subtract(1, 'week'));
    const month = today.clone().subtract(1, 'week').startOf('week').format('MMM');
    const year = today.clone().subtract(1, 'week').format('YYYY');
    // const startDate = today.clone().startOf('week').add(1, 'days').format(formatDate);
    // const endDate = today.clone().endOf('week').add(1, 'days').format(formatDate);
    const startDate = today.clone().subtract(1, 'week').startOf('week').add(1, 'days').format(formatDate);
    const endDate = today.clone().subtract(1, 'week').endOf('week').add(1, 'days').format(formatDate);
    return { startDate, endDate, weekNo, month, year }
}

function weekOfMonth(input) {
    const firstDayOfMonth = input.clone().startOf('month');
    const firstDayOfWeek = firstDayOfMonth.clone().startOf('week');

    const offset = firstDayOfMonth.diff(firstDayOfWeek, 'days');

    return Math.ceil((input.date() + offset - 1) / 7);
}

async function getUserById(userId) {
    const result = await user.get(userId);
    return result;
}

function timeToSec(time) {
    if (time === '00:00:00') return 0;
    const splited = time.split(':');
    return parseInt(splited[0]) * 3600 + parseInt(splited[1]) * 60 + parseInt(splited[2]);
}

function secToTime(sec) {
    if (sec == 0) return '00:00:00';

    const parted = [];
    parted.push((sec % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 }));
    let minutes = Math.floor(sec / 60);
    parted.push((minutes % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 }));
    let hour = Math.floor(minutes / 60);
    parted.push(hour.toLocaleString('en-US', { minimumIntegerDigits: 2 }));
    return parted.reverse().join(':')
}

function roundOff(num) {
    return (Math.floor(num*100))/100;
}

function trimStr(value, length) {
    if (value.length <= length) {
        return value;
    }

    return value.substring(0,length)+'...';
}