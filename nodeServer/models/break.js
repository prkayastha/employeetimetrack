'use strict';
module.exports = (sequelize, DataTypes) => {
    const Break = sequelize.define('Break', {
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
    Break.associate = function (models) {
        // associations can be defined here
        models.Break.belongsTo(models.Timer, { foreignKey: 'timerId' });
    };
    return Break;
};