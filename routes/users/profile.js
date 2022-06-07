const profileRoute = require('express').Router();
const bcrypt = require('bcrypt');
const {
  User, Order, Basket, Drug,
} = require('../../db/models');

profileRoute.get('/', async (req, res) => {
  const { id } = req.session.user;
  const userId = id;
  const user = await User.findByPk(id);
  const orders = await Order.findAll({
    raw: true,
    where: { userId },
    include: [{
      model: Basket,
      attributes: ['id'],
      include: {
        model: Drug,
        attributes: ['name', 'price', 'discountPrice', 'count'],
      },
    },
    ],
  });
  orders.forEach((el) => el.date = el.updatedAt.toString().slice(0, 24));
  console.log(orders);
  req.session.user = user;
  res.render('users/profile', { user, orders });
});

profileRoute.get('/edit', async (req, res) => {
  res.render('users/profileEdit');
});

profileRoute.post('/edit', async (req, res) => {
  try {
    let user = await User.update({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    }, { where: { id: req.session.user.id }, returning: true, plain: true });
    user = await User.findByPk(req.session.user.id);
    req.session.user = user;
    return res.render('users/profile', { user });
  } catch (error) {
    return res.send('Не удалось обновить запись в базе данных.');
  }
});

module.exports = profileRoute;
