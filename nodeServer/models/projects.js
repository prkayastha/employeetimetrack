'use strict';

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
        projectName: {
            allowNull: false,
            type: DataTypes.STRING
        },
        isDelete: {
            type: DataTypes.BOOLEAN
        },
        trelloBoardId: {
            type: DataTypes.STRING
        }
    }, {
        version: true
    });
    Project.associate = function (models) {
        models.Project.belongsTo(models.Users, { as: 'createdBy', foreignKey: 'createdByUserId' });
        models.Project.belongsTo(models.Users, { as: 'projectOwner', foreignKey: 'projectOwnerUserId' });
        models.Project.belongsToMany(models.Users, {through: 'UserProject', as: 'assignees'});
    };
    return Project;
}