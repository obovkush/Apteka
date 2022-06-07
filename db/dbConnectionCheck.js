const { sequelize } = require("./models");

module.exports = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database is up");
  } catch (error) {
    console.log("Database is down", error.message);
  }
};
