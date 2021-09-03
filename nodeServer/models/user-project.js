'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserProject = sequelize.define('UserProject', {
        ProjectId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        UserId: {
            allowNull: false,
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false,
        version: false
    });
    UserProject.associate = function (models) {
        models.UserProject.belongsTo(models.Project);
    }
    return UserProject;
};