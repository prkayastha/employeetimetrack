const models = require('../../models');

module.exports = async function (timer) {
    const timerInsert = {
        startedAt: timer.startedTime,
        endedAt: timer.endTime,
        taskId: timer.taskId,
        userId: timer.userId
    };

    const result = await models.Timer.create(timerInsert);

    const breaksInsert = timer.breaks.map((breakTime) => ({
        startedAt: breakTime.startedTime,
        endedAt: breakTime.endTime,
        timerId: result.id
    }));

    const breakResult = await models.Break.bulkCreate(breaksInsert);
    return breakResult; 
}