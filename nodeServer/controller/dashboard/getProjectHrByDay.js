const sqlQuery = `SELECT 
\`task\`.\`projectId\`,
\`project\`.\`projectName\`,
SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(\`timer\`.\`endedAt\`, \`timer\`.\`startedAt\`)))) AS \`duration\`,
DAYOFWEEK(\`timer\`.\`startedAt\`) AS \`dayOfWeek\`
FROM
Timers \`timer\`
    INNER JOIN
Tasks \`task\` ON \`timer\`.\`taskId\` = \`task\`.\`id\`
INNER JOIN Projects \`project\` on \`project\`.\`id\`=\`task\`.\`projectId\`
WHERE
\`timer\`.\`userId\` = :userId
    AND startedAt BETWEEN :startDate AND :endDate
GROUP BY \`task\`.\`projectId\` , \`project\`.\`projectName\` , dayOfWeek
ORDER BY projectId ASC , dayOfWeek ASC`;
const models = require('../../models');
const momentTz = require('moment-timezone');
const moment = require('moment');

module.exports = async function(userId, offset) {
    const today = momentTz();
    const startDate = today.startOf('week').utcOffset(offset).format();
    const endDate = today.endOf('week').utcOffset(offset).format();

    const result = await models.sequelize.query(
        sqlQuery,
        {
            type: models.Sequelize.QueryTypes.SELECT,
            replacements: { userId, startDate, endDate }
        }
    );

    const projectList = [];

    result.forEach(row => {
        let projectObj = getProjectById(projectList, row.projectId);
        if (!projectObj) {
            projectList.push({projectId: row.projectId, projectName: row.projectName});
            projectObj = getProjectById(projectList, row.projectId);
        };
        if (!projectObj['durationByDay']) {
            projectObj['durationByDay'] = [];
        }
        projectObj['durationByDay'].push({day: row.dayOfWeek, duration: row.duration});
    });

    return projectList;
}

function getProjectById(list, projectId) {
    return list.find(project => project.projectId === projectId);
}

