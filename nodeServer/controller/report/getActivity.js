const momentTz = require('moment-timezone');

const activityQuery = `SELECT \`timer\`.\`id\`, \`task\`.\`taskDescription\`, \`project\`.\`projectName\`, \`timer\`.\`startedAt\`, \`timer\`.\`endedAt\`, timediff(\`timer\`.\`endedAt\`, \`timer\`.\`startedAt\`) as \`duration\` FROM Timers \`timer\` INNER JOIN Tasks \`task\` ON \`timer\`.\`userId\` = \`task\`.\`id\` INNER JOIN Projects \`project\` ON \`task\`.\`projectId\` = \`project\`.\`id\` WHERE userId = :userId and date(\`timer\`.\`startedAt\`) between :startDate and :endDate`;

const models = require('../../models');

module.exports = async function(userId) {
    const today = momentTz(momentTz(), momentTz.tz.guess());
    const startDate = today.clone().subtract(1, 'week').startOf('week').format('YYYY-MM-DD');
    const endDate = today.clone().subtract(1, 'week').endOf('week').format('YYYY-MM-DD');

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