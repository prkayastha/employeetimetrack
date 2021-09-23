const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const moment = require('moment');
const user = require('../../controller/user');

module.exports = async function (userId) {
    
    const userInformation = await getUserById(userId);

    const doc = new PDFDocument({
        size: 'A4',
        margins: 50
    });
    doc.pipe(fs.createWriteStream('./public/reports/Demo.pdf'));

    const dates = getDates();
    const headerInformation = {
        ...dates,
        fullName: `${userInformation['firstname']} ${userInformation['lastname']}`
    };

    generateHeader(doc, headerInformation);

    setTableHeader(doc, 180);

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
        .moveTo(80, y+25)
        .lineTo(510, y+25)
        .stroke();
}

function getDates() {
    const formatDate = 'DD/MM/YYYY'
    const today = moment();
    const startDate = today.startOf('week').format(formatDate);
    const endDate = today.endOf('week').format(formatDate);
    return {startDate, endDate}
}

async function getUserById(userId) {
    const result = await user.get(userId);
    return result;
}