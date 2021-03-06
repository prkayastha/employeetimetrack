const weekSQLQuery = `SELECT SEC_TO_TIME(SUM(time_to_sec(TIMEDIFF(\`break\`.\`endedAt\`, \`break\`.\`startedAt\`)))) AS \`totalBreak\` FROM Timers \`timer\` INNER JOIN Breaks \`break\` ON \`timer\`.\`id\` = \`break\`.\`timerId\` WHERE \`timer\`.\`userId\` = :userId AND \`break\`.\`startedAt\` BETWEEN :startedAt AND :endedAt`

const todaySQLQuery = `SELECT SEC_TO_TIME(SUM(time_to_sec(TIMEDIFF(\`break\`.\`endedAt\`, \`break\`.\`startedAt\`)))) AS \`totalBreak\` FROM Timers \`timer\` INNER JOIN Breaks \`break\` ON \`timer\`.\`id\` = \`break\`.\`timerId\` WHERE \`timer\`.\`userId\` = :userId AND date(\`break\`.\`startedAt\`) = curdate()`;

const models = require('../../models');
const momentTz = require('moment-timezone');

module.exports = async function (userId, previousweek = false) {
    const today = momentTz(momentTz(), momentTz.tz.guess());
    if (previousweek) {
        today.subtract(1, 'week');
    }
    const startDate = today.clone().startOf('week').add(1, 'day').format('YYYY-MM-DDTHH:mm:ssZ');
    const endDate = today.clone().endOf('week').add(1, 'day').format('YYYY-MM-DDTHH:mm:ssZ');
    const weeklyBreak = models.sequelize.query(
        weekSQLQuery,
        {
            type: models.Sequelize.QueryTypes.SELECT,
            replacements: {
                userId,
                startedAt: startDate,
                endedAt: endDate
            }
        }
    );

    const todayBreak = models.sequelize.query(
        todaySQLQuery,
        {
            type: models.Sequelize.QueryTypes.SELECT,
            replacements: {
                userId
            }
        }
    );

    const [weeklyBreakResult, todayBreakResult] = await Promise.all([weeklyBreak, todayBreak]);
    return { weekly: weeklyBreakResult[0].totalBreak || '00:00:00', today: todayBreakResult[0].totalBreak || '00:00:00' };
}