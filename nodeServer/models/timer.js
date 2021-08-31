'use strict';
module.exports = (sequelize, DataTypes) => {
    const Timer = sequelize.define('Timer', {
        startedAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        endedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        timestamps: false,
        version: false
    });
    Timer.associate = function (models) {
        // associations can be defined here
        models.Timer.belongsTo(models.Users, {foreignKey: 'userId'});
        models.Timer.belongsTo(models.Task, {foreignKey: 'taskId'});
        models.Timer.hasMany(models.Break, {foreignKey: 'timerId'});
    };
    return Timer;
};