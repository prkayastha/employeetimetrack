'use strict';

module.exports = (sequelize, DataTypes) => {
    const TrelloAuth = sequelize.define('TrelloAuths', {
        authenticationkey: {
            type: DataTypes.STRING,
            allowNull: true
        },
        verificationKey: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tokenSecret: {
            type: DataTypes.STRING,
            allowNull: true
        },
        accessToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        accessTokenSecret: {
            type: DataTypes.STRING,
            allowNull: true
        },
        UserId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    },{
        version: false,
        freezeTableName: true
    });
    TrelloAuth.associate = function(models) {
        models.TrelloAuths.belongsTo(models.Users, {
            primaryKey: true
        });
    }
    return TrelloAuth;
};