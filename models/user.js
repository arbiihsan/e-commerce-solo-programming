'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile)
      // User.hasMany(models.Transaction)
      User.hasMany(models.Transaction, { foreignKey: 'UserId' })
      User.belongsToMany(models.Product, { through: 'Transaction' })
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    hooks: {
      beforeCreate(instance, options) {
        const salt = bcrypt.genSaltSync(8)
        const hash = bcrypt.hashSync(instance.password, salt)
    
        instance.password = hash
      }
    },
    modelName: 'User',
  });
  return User;
};