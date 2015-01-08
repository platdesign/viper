'use strict';

module.exports = function(db, DataTypes) {
  var User = db.define('User', {
    username: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task);
      }
    }
  });

  return User;
};
