const basketRoute = require('express').Router();
const { Basket, Drug, Order } = require('../db/models');

// Подсчет итоговой стоимости
function findTotal(arr) {
  const price = arr.filter((basket) => basket['Drug.havePromo'] === false);
  let total = 0;
  const price2 = price.map((el) => el['Drug.price']);
  total = price2.map((element, i) => price[i].count * element).reduce((sum, el) => sum + el, 0);
  return total;
}

// подсчет итоговой скидки
function findDiscount(array) {
  const discount = array.filter((basket) => basket['Drug.havePromo'] === true);
  let totalDiscount = 0;
  // eslint-disable-next-line no-return-assign
  const price2 = discount.map((el) => el['Drug.price']);
  // eslint-disable-next-line max-len
  totalDiscount = price2.map((element, i) => discount[i].count * element).reduce((sum, el) => sum + el, 0);
  return totalDiscount;
}

// Добавление товара в корзину
basketRoute.post('/addToBasket', async (req, res) => {
  const check = await Basket.findAll({
    raw: true,
    where: [
      { userId: req.session.user.id },
      { drugId: req.body.id },
      { orderId: null },
    ],
    include: {
      model: Drug,
    },
  });

  const check2 = check.map((el) => el['Drug.havePromo']);

  if (check.length > 0) {
    if (!check2) {
      const newCount = Number(check[0].count + 1);
      await Basket.update(
        {
          count: newCount,
        },
        {
          where: { id: check[0].id },
        },
      );
    }
  } else {
    await Basket.create({
      drugId: req.body.id,
      userId: req.session.user.id,
      count: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  res.end();
});

// Отрисовка корзины
basketRoute.get('/basket', async (req, res) => {
  const allBaskets = await Basket.findAll({
    raw: true,
    where: [
      { userId: req.session.user.id },
      { orderId: null },
    ],
    include: {
      model: Drug,
    },
    order: [
      [{ model: Drug }, 'id', 'DESC'],
    ],
  });

  const total = findTotal(allBaskets);
  const totalDiscount = findDiscount(allBaskets);
  // console.log(total);

  res.render('basket', { allBaskets, total, totalDiscount });
});

// кор-ка товара в корзине(-)
basketRoute.post('/minus', async (req, res) => {
  const { id } = req.body;
  const basket = await Basket.findByPk(id, {
    raw: true,
  });

  const newCount = basket.count - 1;

  if (newCount > 0) {
    await Basket.update(
      {
        count: newCount,
      },
      {
        where:
          { id },
      },
    );

    const allBaskets = await Basket.findAll({
      raw: true,
      where: [
        { userId: req.session.user.id },
        { orderId: null },
      ],
      include: {
        model: Drug,
      },
      order: [
        [{ model: Drug }, 'id', 'DESC'],
      ],
    });
    const total = findTotal(allBaskets);
    const totalDiscount = findDiscount(allBaskets);

    res.render('basket', {
      layout: false,
      allBaskets,
      total,
      totalDiscount,
    });
  } else {
    await Basket.destroy({
      where: { id },
    });

    const allBaskets = await Basket.findAll({
      raw: true,
      where: [
        { userId: req.session.user.id },
        { orderId: null },
      ],
      include: {
        model: Drug,
      },
      order: [
        [{ model: Drug }, 'id', 'DESC'],
      ],
    });

    const total = findTotal(allBaskets);
    const totalDiscount = findDiscount(allBaskets);

    res.render('basket', {
      layout: false,
      allBaskets,
      total,
      totalDiscount,
    });
  }
});

// Передаем итоговую сумму в отрисовку страницы заказа
basketRoute.post('/addToOrder', (req, res) => {
  const { total } = req.body;
  res.render('order', {
    total,
    layout: false,
  });
});

// кор-ка корзины (+)
basketRoute.post('/plus', async (req, res) => {
  const { id } = req.body;
  const basket = await Basket.findByPk(id, {
    raw: true,
    include: {
      model: Drug,
    },
  });

  // console.log(basket['Drug.havePromo']);
  if (!basket['Drug.havePromo']) {
    const newCount = basket.count + 1;
    await Basket.update(
      {
        count: newCount,
      },
      {
        where:
          { id },
      },
    );

    const allBaskets = await Basket.findAll({
      raw: true,
      where: [
        { userId: req.session.user.id },
        { orderId: null },
      ],
      include: {
        model: Drug,
      },
      order: [
        [{ model: Drug }, 'id', 'DESC'],
      ],
    });
    const total = findTotal(allBaskets);
    const totalDiscount = findDiscount(allBaskets);

    res.render('basket', {
      layout: false,
      allBaskets,
      total,
      totalDiscount,
    });
  } else {
    res.send('Внимание! Акционный товар можно добавлять в корзину только в единичном экземпляре');
  }
});

// отрисовка страницы заказа
basketRoute.get('/order', async (req, res) => {
  const allBaskets = await Basket.findAll({
    raw: true,
    where: [
      { userId: req.session.user.id },
      { orderId: null },
    ],
    include: {
      model: Drug,
    },
  });
  const total = findTotal(allBaskets);
  res.render('order', { total });
});

// Запись в базу данных о заказе, завершение оформления
basketRoute.post('/order/status', async (req, res) => {
  const { adress, tel } = req.body;
  // console.log(adress, tel);
  const allBaskets = await Basket.findAll({
    raw: true,
    where: [
      { userId: req.session.user.id },
      { orderId: null },
    ],
    include: {
      model: Drug,
    },
  });

  // const drugIdNew = allBaskets.map((drug) => drug['Drug.id']);
  // const drugCountNew = allBaskets.map((drug) => drug['Drug.count']);
  // console.log(drugIdNew, drugCountNew);

  const total = findTotal(allBaskets);
  // console.log(adress, tel, total);
  const order = await Order.create({
    adress,
    tel,
    total,
    userId: req.session.user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await Basket.update(
    {
      orderId: order.id,
    },
    {
      where: [
        { orderId: null },
        { userId: req.session.user.id },
      ],
    },
  );
  res.render('success');
});

module.exports = basketRoute;
