'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
        RoleId: {
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
    return UserRole;
};