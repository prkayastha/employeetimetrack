const models = require('../../models');
const moment = require('moment-timezone');
const UnauthorizedError = require('../../prototypes/responses/authorization/unauthorized');
module.exports = async function (dateInfo, userInfo) {
    const canAccess = await checkRole(userInfo, dateInfo.userId);

    if (!canAccess) {
        const err = new UnauthorizedError('Cannot access');
        throw err;
    }

    const dateString = `${dateInfo.date}T00:00:00${dateInfo.offset}`;
    const dateMoment = moment(dateString);
    const diary = await models.Screenshot.findAll({
        include: [{ model: models.Task, attributes: ['taskDescription'] }],
        where: {
            assigneeUserId: +dateInfo.userId,
            createdAt: {
                [models.Sequelize.Op.between]: [
                    dateMoment.format(),
                    dateMoment.add(1, 'day').subtract(1, 'seconds').format()
                ]
            }
        },
        order: [['createdAt', 'ASC']]
    });
    return newGroup(diary, dateInfo);;
    // return group(diary, dateInfo);
}

function newGroup(list, dateInfo) {
    let groupObj = {};

    list.forEach(screenshot => {
        const localTime = moment(screenshot.createdAt).utcOffset(dateInfo.offset);
        const hour = localTime.hour();

        if (!groupObj[hour]) {
            groupObj[hour] = [];
        }

        groupObj[hour].push(screenshot);
    });

    groupObj = groupTasks(groupObj);

    const mappedList = [];
    for (let key of Object.keys(groupObj)) {
        const organize = {};
        organize['time'] = convertTo12Hr(key);        
        organize['taskInfo'] = groupObj[key].map(each => {
            const grouping = {};
            grouping['taskId'] = each[0].TaskId;
            grouping['taskDescription'] = each[0].Task.taskDescription;
            grouping['log'] = each.map(eachLog => {
            const localMoment = moment(eachLog.createdAt).utcOffset(dateInfo.offset);
                return {
                    id: eachLog.id,
                    location: eachLog.location,
                    unproductive: eachLog.unproductive,
                    timeMinutes:  Math.floor(localMoment.minute() / 10) * 10,
                    screenshotTakenAt: localMoment.format()
                }
            })
            return grouping;
        });
        mappedList.push(organize);
    }

    return mappedList;
}

function groupTasks(groupObj) {
    for (let key of Object.keys(groupObj)) {
        const groupedList = [];
        let lowerBound = 0;
        for (let i=0; i<groupObj[key].length; i++) {
            if (groupObj[key].length == 1) {
                groupedList.push(groupObj[key].slice(0, i+1))
                break;
            }

            if (i == groupObj[key].length-1) {
                if (groupObj[key][i-1].TaskId == groupObj[key][i].TaskId) {
                    groupedList.push(groupObj[key].slice(lowerBound, i+1));
                } else {
                    groupedList.push(groupObj[key].slice(lowerBound, i));
                    groupedList.push(groupObj[key].slice(i, i+1))
                }
                break;
            }
            
            if (i==0) continue;

            if (groupObj[key][i-1].TaskId == groupObj[key][i].TaskId) {
                continue;
            }

            groupedList.push(groupObj[key].slice(lowerBound, i));
            lowerBound = i;
        }

        groupObj[key] = groupedList;
    }

    return groupObj;
}

function convertTo12Hr(hour) {
    return `${hour == 12 ? 12 : hour % 12} ${hour == 12 ? 'PM' : Math.floor(hour / 12) == 0 ? 'AM' : 'PM'}`;
}

async function checkRole(userInfo, queryUserId) {
    const query = 'SELECT * from UserRoles where UserId=?';

    const result = await models.sequelize.query(
        query,
        {
            type: models.Sequelize.QueryTypes.SELECT,
            replacements: [userInfo.id]
        }
    );

    const roleId = result[0].RoleId;

    if (roleId == 1 || roleId == 2) {
        return true;
    }

    if (roleId == 3 && queryUserId == userInfo.id) {
        return true;
    }

    return false;
}