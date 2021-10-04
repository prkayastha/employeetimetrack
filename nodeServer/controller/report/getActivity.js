const momentTz = require('moment-timezone');

const activityQuery = `SELECT \`timer\`.\`id\`, \`task\`.\`taskDescription\`, \`project\`.\`projectName\`, \`timer\`.\`startedAt\`, \`timer\`.\`endedAt\`, timediff(\`timer\`.\`endedAt\`, \`timer\`.\`startedAt\`) as \`duration\` FROM Timers \`timer\` INNER JOIN Tasks \`task\` ON \`timer\`.\`taskId\` = \`task\`.\`id\` INNER JOIN Projects \`project\` ON \`task\`.\`projectId\` = \`project\`.\`id\` WHERE userId = :userId and \`timer\`.\`startedAt\` between :startDate and :endDate`;

const models = require('../../models');

module.exports = async function(userId, previousweek = true) {
    const today = momentTz(momentTz(), momentTz.tz.guess());
    if (previousweek) {
        today.subtract(1, 'week');
    }
    const startDate = today.clone().startOf('week').add(1, 'day').format('YYYY-MM-DDTHH:mm:ssZ');
    const endDate = today.clone().endOf('week').add(1, 'day').format('YYYY-MM-DDTHH:mm:ssZ');

    const rows = await models.sequelize.query(
        activityQuery,
        {
            type: models.Sequelize.QueryTypes.SELECT,
            replacements: {
                userId,
                startDate,
                endDate
            }
        }
    );

    return rows;
}