const moment = require('moment');
const models = require('../../models');
const env = process.env.NODE_ENV || 'development'
const config = require('../../config/settings.json')[env];
const server = config.apiURL;

module.exports = async function(userId) {
    const today = moment().format('YYYY');
    const whereObj = {
        userId,
        createdAt: models.Sequelize.where(models.Sequelize.fn('Year', models.Sequelize.col('createdAt')), today)
    }
    const result = await models.Report.findAll({where: whereObj});
    return result.map(report => {
        return {
            name: report.location,
            url: `${server}/report/${report.location}`
        }
    });
}