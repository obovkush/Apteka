"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Basket }) {
      this.belongsTo(User, {
        foreignKey: "userId",
      });
      this.hasMany(Basket, {
        foreignKey: "orderId",
      });
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
      adress: DataTypes.TEXT,
      tel: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
