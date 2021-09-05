const models = require('../../models');
const moment = require('moment-timezone');

module.exports = async function (dateInfo, userInfo) {
    const dateString = `${dateInfo.date}T00:00:00${dateInfo.offset}`;
    const dateMoment = moment(dateString);
    const diary = await models.Screenshot.findAll({
        where: {
            assigneeUserId: +userInfo.id,
            createdAt: {
                [models.Sequelize.Op.between]: [
                    dateMoment.format(),
                    dateMoment.add(1, 'day').subtract(1, 'seconds').format()
                ]
            }
        }
    });
    return group(diary, dateInfo);
}

function group(list, dateInfo) {
    const groupObj = {};

    list.forEach(screenshot => {
        const localTime = moment(screenshot.createdAt).utcOffset(dateInfo.offset);
        const hour = localTime.hour();

        if (!groupObj[hour]) {
            groupObj[hour] = {};
        }

        if (!groupObj[hour][screenshot.TaskId]) {
            groupObj[hour][screenshot.TaskId] = [];
        }

        groupObj[hour][screenshot.TaskId].push(screenshot);
    });

    const organizedList = [];
    for (let key of Object.keys(groupObj)) {
        const organizeObj = {};
        organizeObj['timeHour'] = convertTo12Hr(key);
        organizeObj['taskInfo'] = [];

        for (let taskKey of Object.keys(groupObj[key])) {
            const taskObj = {};
            taskObj['taskId'] = taskKey;
            taskObj['captures'] = groupObj[key][taskKey].map(eachTask => {
                const localMoment = moment(eachTask.createdAt).utcOffset(dateInfo.offset);
                return {
                    id: eachTask.id,
                    location: eachTask.location,
                    unproductive: eachTask.unproductive,
                    timeMinute: Math.floor(localMoment.minute() / 10) * 10,
                    screenshotTakenAt: localMoment.format()
                }
            });
            taskObj['captures'] = taskObj['captures'].filter((captures, index) => (
                taskObj['captures'].map(each => each.timeMinute).indexOf(captures.timeMinute) == index
            ));
            organizeObj['taskInfo'].push(taskObj);
        }

        organizedList.push(organizeObj);
    }

    return organizedList;
}

function convertTo12Hr(hour) {
    return `${hour%12} ${Math.floor(hour/12)==0?'AM':'PM'}`;
}