'use strict';

module.exports = (sequelize, DataTypes) => {
    const TrelloAuth = sequelize.define('TrelloAuths', {
        userId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false
        },
        authenticationkey: {
            type: DataTypes.STRING,
            allowNull: false
        },
        verificationKey: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{});
    return TrelloAuth;
};