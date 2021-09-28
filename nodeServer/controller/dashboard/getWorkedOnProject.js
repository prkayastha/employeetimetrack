const models = require('../../models');
const sqlQuery = `SELECT 
distinct(\`project\`.\`id\`),
\`project\`.\`projectName\`,
max(\`timer\`.\`startedAt\`) as lastWorkedAt
FROM
Timers \`timer\`
    INNER JOIN
Tasks \`task\` ON \`timer\`.\`taskId\` = \`task\`.\`id\`
    INNER JOIN
Projects \`project\` ON \`task\`.\`projectId\` = \`project\`.\`id\`
WHERE
\`timer\`.\`userId\` = ?
group by \`project\`.\`id\`
limit 5;`;

module.exports = async function(userId) {
    const result = await models.sequelize.query(
        sqlQuery,
        {
            type: models.Sequelize.QueryTypes.SELECT,
            replacements: [userId]
        }
    );
    return result;
}