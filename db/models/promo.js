"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Promo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Drug }) {
      this.hasMany(Drug, {
        foreignKey: "promoId",
      });
    }
  }
  Promo.init(
    {
      date: DataTypes.DATEONLY,
      end: DataTypes.DATEONLY,
      discount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Promo",
    }
  );
  return Promo;
};
