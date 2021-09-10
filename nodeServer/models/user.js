'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    firstname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastSignIn: {
      allowNull: true,
      type: DataTypes.DATE
    },
    deleted: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    active: { 
      allowNull: false, 
      type: DataTypes.BOOLEAN 
    },
    failedAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastFailedAttempts: {
      type: DataTypes.DATE,
    }
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    models.Users.hasMany(models.Password);
    models.Users.belongsToMany(models.Roles, {through: 'UserRole', as: 'roles'});
    models.Users.belongsToMany(models.Project, {through: 'UserProject', as: 'projects'})
    models.Users.hasOne(models.UserDetails);
  };
  return User;
};