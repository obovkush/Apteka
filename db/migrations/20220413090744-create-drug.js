"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Drugs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      count: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      image: {
        type: Sequelize.TEXT,
      },
      info: {
        type: Sequelize.STRING,
      },
      discountPrice: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      havePromo: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      categoryId: {
        type: Sequelize.INTEGER,
      },
      promoId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Promos",
          },
          key: "id",
        },
      },

      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Drugs");
  },
};
