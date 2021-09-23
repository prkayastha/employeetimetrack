const sqlQuery = `SELECT \`distinctTask\`.\`projectId\`, SEC_TO_TIME(SUM(durationTask)) AS \`timeForProject\`, IF(\`screenCount\`.\`unproductive\` IS NOT NULL, \`screenCount\`.\`unproductive\`,0) AS \`unproductive\`, IF(\`screenCount\`.\`totalScreen\` IS NOT NULL, \`screenCount\`.\`totalScreen\`,0) AS \`totalScreen\` FROM(SELECT DISTINCT (\`timer\`.\`taskId\`), \`task\`.\`projectId\`, TIME_TO_SEC(DURATION(\`timer\`.\`taskId\`, \`timer\`.\`userId\`, '+09:30')) AS \`durationTask\` FROM Timers \`timer\` INNER JOIN Tasks \`task\` ON \`timer\`.\`taskId\` = \`task\`.\`id\` WHERE \`timer\`.\`userId\` = :userId) AS distinctTask LEFT JOIN (SELECT COUNT(IF(\`screenshots\`.\`unproductive\` = TRUE, 1, NULL)) AS \`unproductive\`, COUNT(*) AS totalScreen, \`screenshots\`.\`TaskId\`, \`task\`.\`projectId\` FROM Screenshots \`screenshots\` INNER JOIN Tasks \`task\` ON \`screenshots\`.\`TaskId\` = \`task\`.\`id\` WHERE \`screenshots\`.\`assigneeUserId\` = :userId AND \`screenshots\`.\`createdAt\` BETWEEN '2021-09-20' AND '2021-09-26' GROUP BY projectId) AS \`screenCount\` ON \`distinctTask\`.\`projectId\` = \`screenCount\`.\`projectId\` GROUP BY \`distinctTask\`.\`projectId\``;
const models = require('../../models');

module.exports = async function (userId) {
    const result = await models.sequelize.query(
        sqlQuery,
        {
            type: models.Sequelize.QueryTypes.SELECT,
            replacements: { userId }
        }
    );
    return result;
}