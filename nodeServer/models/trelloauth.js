'use strict';

module.exports = (sequelize, DataTypes) => {
    const TrelloAuth = sequelize.define('TrelloAuths', {
        authenticationkey: {
            type: DataTypes.STRING,
            allowNull: false
        },
        verificationKey: {
            type: DataTypes.STRING,
            allowNull: false
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