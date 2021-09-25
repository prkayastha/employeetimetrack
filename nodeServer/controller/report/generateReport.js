const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const moment = require('moment');
const getReport = require('./getReport');
const instertIntoDB = require('./insertReportInfo');
const user = require('../../controller/user');

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
    const reportInfo = await getReport(userId);

    const doc = new PDFDocument({
        size: 'A4',
        margins: 50
    });

    const dates = getDates();
    const headerInformation = {
        ...dates,
        fullName: `${userInformation['firstname']} ${userInformation['lastname']}`
    };
    const fileName = `${headerInformation.fullName.replace(/s+/g, ' ').replace('-')}-${dates.year}-${dates.month}-Week-${dates.weekNo}.pdf`;
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

    setTableRow(doc, reportInfo)

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
    doc.text('Productive', 310, y).moveDown().text('Screen', 310);
    doc.text('Unproductive', 380, y).moveDown().text('Screen', 380);
    doc.text('Productivity', 460, y);
    doc.lineWidth(1);
    doc.lineCap('butt')
        .moveTo(80, y + 25)
        .lineTo(510, y + 25)
        .stroke();
}

function setTableRow(doc, information) {
    doc.font('Helvetica');
    const top = 220
    let totalTime = 0;
    let totalProductiveScreen = 0;
    let totalUnproductiveScreen = 0;
    let productive = [];
    for (let i = 0; i < information.length; i++) {
        const row = information[i];
        totalTime = totalTime + timeToSec(row.timeForProject);
        totalProductiveScreen = totalProductiveScreen + (row.totalScreen - row.unproductive);
        totalUnproductiveScreen = totalUnproductiveScreen + row.unproductive;
        if (row.totalScreen > 0) {
            productive.push(row.unproductive / row.totalScreen)
        }
        doc.text(row.projectName, 80, top + (i * 35), { width: 150 });
        doc.text(row.timeForProject, 230, top + (i * 35), { width: 100 });
        doc.text(row.totalScreen - row.unproductive, 310, top + (i * 35));
        doc.text(row.unproductive, 380, top + (i * 35));
        doc.text(row.totalScreen == 0 ? 'N/A' : 1 - (row.unproductive / row.totalScreen), 460, top + (i * 35));
        doc.lineWidth(0.5);
        doc.lineCap('butt')
            .moveTo(80, doc.y + 20)
            .lineTo(510, doc.y + 20)
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
    doc.text(`Total Time Recorded: ${totalTime}`, 80, doc.y + 50, { width: 510, align: 'left' });
    doc.text(`Total Recorded Productive Screens: ${totalProductiveScreen}`, 80, doc.y, { width: 510, align: 'left' });
    doc.text(`Total Recorded Unproductive Screens: ${totalUnproductiveScreen}`, 80, doc.y, { width: 510, align: 'left' });
    doc.text(`Total Productive Rate: ${(1 - averageProd) * 100}%`, 80, doc.y, { width: 510, align: 'left' });
}

function getDates() {
    const formatDate = 'DD/MM/YYYY'
    const today = moment();
    const weekNo = weekOfMonth(today.clone()) - 1;
    const month = today.clone().subtract(1, 'week').startOf('week').format('MMM');
    const year = today.clone().format('YYYY');
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