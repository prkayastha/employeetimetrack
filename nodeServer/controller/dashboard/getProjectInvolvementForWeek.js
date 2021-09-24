const sqlQuery = `SELECT 
projectId, SEC_TO_TIME(SUM(durationTask)) as timeForProject
FROM
(SELECT DISTINCT
    (\`timer\`.\`taskId\`),
        \`task\`.\`projectId\`,
        TIME_TO_SEC(DURATION(\`timer\`.\`taskId\`, :userId, :offset)) AS durationTask
FROM
    Timers \`timer\`
LEFT JOIN Tasks \`task\` ON \`timer\`.\`taskId\` = \`task\`.\`id\`
WHERE
    \`timer\`.\`userId\` = :userId) AS distinctTask
GROUP BY projectId;`;
const models = require('../../models');

module.exports = async function(userId, offset) {
    const result = await models.sequelize.query(
        sqlQuery,
        {
            type: models.Sequelize.QueryTypes.SELECT,
            replacements: {
                userId,
                offset
            }
        }
    );
    return result;
}