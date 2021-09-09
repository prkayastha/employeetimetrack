'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserDetails = sequelize.define('UserDetails', {
        designation: {
            type: DataTypes.STRING
        },
        skills: {
            type: DataTypes.TEXT
        }
    }, {
        timestamps: false,
        version: false
    });
    UserDetails.associate = function (models) {
        // associations can be defined here
    };
    return UserDetails;
};