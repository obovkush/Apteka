const adminRoute = require("express").Router();
const { Drug } = require("../../db/models");

adminRoute.get("/admin", (req, res) => {
  res.render("admin");
});

adminRoute.post("/admin", async (req, res) => {
  const { name, price, info, categoryId, count, discountPrice, havePromo } =
    req.body;
  const newDrug = await Drug.create({
    name,
    price,
    info,
    categoryId,
    count,
    discountPrice,
    havePromo,
  });
  res.redirect("/admin");
});

module.exports = adminRoute;
