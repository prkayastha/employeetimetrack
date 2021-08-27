'use strict';
module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        taskDescription: {
            allowNull: false,
            type: DataTypes.STRING
        },
        isDelete: {
            default: false,
            type: DataTypes.BOOLEAN
        }
    }, {});
    Task.associate = function (models) {
        // associations can be defined here
        models.Task.belongsTo(models.Project, {foreignKey: 'projectId'});
    };
    return Task;
};