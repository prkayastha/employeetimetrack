const sqlQuery = `SELECT \`Project\`.\`projectName\`,
\`UserProject\`.\`createdAt\` AS \`assignedDate\`
FROM
UserProjects \`UserProject\`
    INNER JOIN
Projects \`Project\` ON \`UserProject\`.\`ProjectId\` = \`Project\`.\`id\`
WHERE
    UserId = ?
ORDER BY \`UserProject\`.\`createdAt\` DESC
LIMIT 5;`
const models = require('../../models');

module.exports = async function (userId) {
    const result = await models.sequelize.query(
        sqlQuery,
        {
            type: models.Sequelize.QueryTypes.SELECT,
            replacements: [userId]
        }
    );
    return result;
}

