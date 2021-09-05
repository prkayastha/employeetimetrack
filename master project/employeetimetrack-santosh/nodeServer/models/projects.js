'use strict';

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
        projectName: {
            allowNull: false,
            type: DataTypes.STRING
        },
        isDelete: {
            type: DataTypes.BOOLEAN
        }
    }, {
        version: true
    });
    Project.associate = function (models) {
        models.Project.belongsTo(models.Users, { as: 'createdBy', foreignKey: 'createdByUserId' });
        models.Project.belongsTo(models.Users, { as: 'projectOwner', foreignKey: 'projectOwnerUserId' });
    };
    return Project;
}