'use strict';
const {
  Model
} = require('sequelize');
const { Op } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, { foreignKey: 'UserId' })
      Transaction.belongsTo(models.Product, { foreignKey: 'ProductId' })
    }
    static getTransactionsByProduct(searchProduct) {
      return Transaction.findAll({
        include: [
            {
                model: sequelize.models.User,
                include: {
                    model: sequelize.models.UserProfile,
                },
            },
            {
                model: sequelize.models.Product,
            },
        ],
        where: { nameOfTransaction: { [Op.iLike]: `%${searchProduct}%` } }
    })
    }
    formatDate() {
      const createdDateTemp = new Date(this.createdAt);
      return createdDateTemp.toISOString().split('T')[0];
    }
  }
  Transaction.init({
    status: DataTypes.BOOLEAN,
    nameOfTransaction: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};