'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category)
      // Product.hasMany(models.Transaction)
      Product.hasMany(models.Transaction, { foreignKey: 'ProductId' })
      Product.belongsToMany(models.User, { through: 'Transaction' })
    }
  }
  Product.init({
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'productName cannot be null'
        },
        notEmpty: {
          msg: 'productName cannot be empty'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'description cannot be null'
        },
        notEmpty: {
          msg: 'description cannot be empty'
        }
      }
    },
    price:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'price cannot be null'
        },
        notEmpty: {
          msg: 'price cannot be empty'
        },
        min: {
          args: 1,
          msg: 'Minimum price is 1'
        }
      }
    },
    stock:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'stock cannot be null'
        },
        notEmpty: {
          msg: 'stock cannot be empty'
        },
        min: {
          args: 1,
          msg: 'Minimum stock is 1'
        }
      }
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'image cannot be null'
        },
        notEmpty: {
          msg: 'image cannot be empty'
        }
      }
    },
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};