'use strict';
module.exports = (sequelize, DataTypes) => {
  const Screenshots = sequelize.define('Screenshot', {
    location: {
      allowNull: false,
      type: DataTypes.STRING
    },
    unproductive: {
        default: false,
        type: DataTypes.BOOLEAN
    }
  }, {
  });
  Screenshots.associate = function(models) {
    // associations can be defined here
    models.Screenshot.belongsTo(models.Task);
  };
  return Screenshots;
};