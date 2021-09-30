const weeklyHrQuery = `SELECT sec_to_time(SUM(TIME_TO_SEC(TIMEDIFF(\`timer\`.\`endedAt\`, \`timer\`.\`startedAt\`)))) as \`workingHr\`, \`timer\`.\`userId\` FROM Timers \`timer\` WHERE \`timer\`.\`userId\` = :userId AND \`timer\`.\`startedAt\` BETWEEN :startDate AND :endDate GROUP BY \`timer\`.\`userId\``;

const dailyHrQuery = `SELECT sec_to_time(SUM(TIME_TO_SEC(TIMEDIFF(\`timer\`.\`endedAt\`, \`timer\`.\`startedAt\`)))) as \`workingHr\`, \`timer\`.\`userId\` FROM Timers \`timer\` WHERE \`timer\`.\`userId\` = :userId AND date(\`timer\`.\`startedAt\`) = :startDate GROUP BY \`timer\`.\`userId\``;

const models = require('../../models');
const momentTz = require('moment-timezone');

module.exports = async function(userId) {
    const today = momentTz(momentTz(), momentTz.tz.guess());
    const startedAt = today.clone().startOf('week').format('YYYY-MM-DD');
    const endedAt = today.clone().endOf('week').format('YYYY-MM-DD');

    const weeklyHrPromise = models.sequelize.query(
        weeklyHrQuery,
        {
            type: models.Sequelize.QueryTypes.SELECT,
            replacements: {
                userId,
                startDate: startedAt,
                endDate: endedAt
            }
        }
    );

    const dailyHrPromise = models.sequelize.query(
        dailyHrQuery,
        {
            type: models.Sequelize.QueryTypes.SELECT,
            replacements: {
                userId,
                startDate: today.format('YYYY-MM-DD')
            }
        }
    );

    const [ todayRes, weeklyRes ] = await Promise.all([dailyHrPromise, weeklyHrPromise]);

    return { today: todayRes[0].workingHr, weekly: weeklyRes[0].workingHr };
}