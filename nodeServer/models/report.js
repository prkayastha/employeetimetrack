'use strict';
module.exports = (sequelize, DataTypes) => {
    const Break = sequelize.define('Report', {
        location: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            autoIncrement: false
        }
    }, {
        timestamps: true
    });
    Break.associate = function (models) {
        // associations can be defined here
        models.Report.belongsTo(models.Users, { foreignKey: 'userId' });
    };
    return Break;
};