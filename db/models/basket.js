"use strict";
const { Model } = require("sequelize");
const order = require("./order");
module.exports = (sequelize, DataTypes) => {
  class Basket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Order, Drug }) {
      this.belongsTo(User, {
        foreignKey: "userId",
      });
      this.belongsTo(Order, {
        foreignKey: "orderId",
      });
      this.belongsTo(Drug, {
        foreignKey: "drugId",
      });
    }
  }
  Basket.init(
    {
      drugId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Basket",
    }
  );
  return Basket;
};
