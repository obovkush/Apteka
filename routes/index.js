const indexRoute = require('express').Router();
// const checkAuth = require('../middleware/checkAuth');

const { Op } = require('sequelize');
const { Drug, Promo } = require('../db/models');

// получаем отформатированную дату
async function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10
    ? `0${date.getMonth() + 1}`
    : date.getMonth() + 1;
  const day = date.getDate() < 10
    ? `0${date.getDate()}`
    : date.getDate();
  const dateInFormatYYYYMMDD = `${year}-${month}-${day}`;
  return dateInFormatYYYYMMDD;
}

async function promoUpdate() {
  const allPromo = await Promo.findAll({ raw: true });

  // получаем сегодняшнюю дату
  const day = Number(new Date().getDate());
  const rightDay = (day < 10) ? `0${day}` : day;
  const month = Number((new Date().getMonth()) + 1);
  const rightMonth = (month < 10) ? `0${month}` : month;
  const year = Number(new Date().getFullYear());
  const now = `${year}-${rightMonth}-${rightDay}`;

  // ищем актуальную акцию
  const currentPromo = allPromo.filter((promo) => promo.date <= now && promo.end >= now);

  // обновляем БД по акционным товарам
  await Drug.update(
    {
      havePromo: true,
      discountPrice: 0,
    },
    { where: { promoId: currentPromo[0].id } },
  );

  // возвращаем false у тех товаров, у которых промо прошло
  await Drug.update(
    {
      havePromo: false,
    },
    {
      where: [
        { havePromo: true },
        { [Op.not]: { promoId: currentPromo[0].id } },
      ],
    },
  );
}

indexRoute.get('/', async (req, res) => {
  const drugs = await Drug.findAll({
    raw: true,
    order: [['price', 'DESC']],
    include: {
      model: Promo,
    },
  });

  const allPromo = await Promo.findAll({ raw: true });

  // ищем актуальную акцию
  let now = new Date();
  now = await formatDate(now);
  const currentPromo = allPromo.filter((promo) => promo.date <= now
    && promo.end >= now);

  const currentPromoID = currentPromo[0].id;

  // вытаскиваем массив лекарств участвующих в актуальной акции
  const currentPromoDrugs = await Drug.findAll({
    where: { promoId: currentPromoID },
    raw: true,
  });

  // ищем акцию через 7 дней
  let sevenDaysFromNow = new Date(new Date().setDate(new Date().getDate() + 7));
  sevenDaysFromNow = await formatDate(sevenDaysFromNow);
  const sevenDayPromo = allPromo.filter((promo) => promo.date <= sevenDaysFromNow
    && promo.end >= sevenDaysFromNow);

  const sevenDayPromoID = sevenDayPromo[0].id;

  // вытаскиваем массив лекарств участвующих в акции через 7 дней
  const sevenDayPromoDrugs = await Drug.findAll({
    where: { promoId: sevenDayPromoID },
    raw: true,
  });

  promoUpdate();

  res.render('index', {
    drugs, currentPromo, sevenDayPromo, currentPromoDrugs, sevenDayPromoDrugs,
  });
});

indexRoute.post('/drug/id', async (req, res) => {
  const { name } = req.body;
  const drugs = await Drug.findAll({ raw: true });
  const result = drugs.filter((el) => el.name.toLowerCase().includes(name.toLowerCase()));
  console.log(result);
  if (result.length > 0) {
    res.send(`${result[0].id}`);
  } else {
    res.send('not');
  }
});

indexRoute.get('/drugs/undef', (req, res) => {
  res.render('undef');
});

indexRoute.get('/drugs/:id', async (req, res) => {
  const drug = await Drug.findByPk(req.params.id, { raw: true });
  res.render('find', drug);
});

module.exports = indexRoute;
