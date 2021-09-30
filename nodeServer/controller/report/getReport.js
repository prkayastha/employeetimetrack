const sqlQuery = `SELECT \`distinctTask\`.\`projectId\`, \`distinctTask\`.\`projectName\`, SEC_TO_TIME(SUM(durationTask)) AS \`timeForProject\`, SEC_TO_TIME(SUM(breakDuration)) AS \`timeForBreak\`, IF(\`screenCount\`.\`unproductive\` IS NOT NULL, \`screenCount\`.\`unproductive\`, 0) AS \`unproductive\`, IF(\`screenCount\`.\`totalScreen\` IS NOT NULL, \`screenCount\`.\`totalScreen\`, 0) AS \`totalScreen\` FROM(SELECT DISTINCT \`timer\`.\`taskId\`, \`task\`.\`projectId\`, \`project\`.\`projectName\`, TIME_TO_SEC(DURATION(\`timer\`.\`taskId\`, \`timer\`.\`userId\`, '+09:30')) AS \`durationTask\`, TIME_TO_SEC(BREAKDURATION(\`timer\`.\`taskId\`, \`timer\`.\`userId\`, '+09:30')) AS \`breakDuration\` FROM Timers \`timer\` INNER JOIN Tasks \`task\` ON \`timer\`.\`taskId\` = \`task\`.\`id\` INNER JOIN Projects \`project\` ON \`project\`.\`id\` = \`task\`.\`projectId\` WHERE \`timer\`.\`userId\` = :userId) AS distinctTask LEFT JOIN (SELECT COUNT(IF(\`screenshots\`.\`unproductive\` = TRUE, 1, NULL)) AS \`unproductive\`, COUNT(*) AS totalScreen, \`task\`.\`projectId\` FROM Screenshots \`screenshots\` INNER JOIN Tasks \`task\` ON \`screenshots\`.\`TaskId\` = \`task\`.\`id\` WHERE \`screenshots\`.\`assigneeUserId\` = :userId AND \`screenshots\`.\`createdAt\` BETWEEN :startDate AND :endDate GROUP BY projectId) AS \`screenCount\` ON \`distinctTask\`.\`projectId\` = \`screenCount\`.\`projectId\` GROUP BY \`distinctTask\`.\`projectId\` , \`distinctTask\`.\`projectName\` , \`unproductive\` , \`totalScreen\`;`;
const models = require('../../models');
const momentTz = require('moment-timezone');

module.exports = async function (userId) {
    const today = momentTz(momentTz(), momentTz.tz.guess());
    const startDate = today.clone().startOf('week').format('YYYY-MM-DD');
    const endDate = today.clone().endOf('week').format('YYYY-MM-DD');
    const result = await models.sequelize.query(
        sqlQuery,
        {
            type: models.Sequelize.QueryTypes.SELECT,
            replacements: { userId, startDate, endDate }
        }
    );
    return result;
}