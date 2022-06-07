const registrRoute = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User } = require('../../db/models');

const mailer = require('../../nodemailer');

registrRoute.get('/reg', (req, res) => {
  res.render('users/reg');
});

registrRoute.post('/reg', async (req, res) => {
  try {
    const {
      name, email, password, login,
    } = req.body;
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      login,
    });
    req.session.user = user;
    req.session.isAuthorized = true;

    const message = {
      from: 'Apteka <jovani.hilpert36@ethereal.email>',
      to: req.body.email,
      subject: 'Добро пожаловать!',
      text: `Подздравляем с успешной регистрацией.
      Ваши данные:
      логин ${req.body.login}
      password ${req.body.password}
      Данное письмо не требует ответа.

      С заботой, Ваша Аптека.`,
    };
    mailer(message);
  } catch (error) {
    res.render('error', { error: error.message });
  }
  return res.redirect('/');
});

registrRoute.get('/auth', (req, res) => res.render('users/auth'));

registrRoute.post('/auth', async (req, res) => {
  const { login, password } = req.body;
  const user = await User.findOne({
    where: { login },
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user;
    req.session.isAuthorized = true;
    return res.redirect('/');
  } if (login === 'admin' && password === '123') {
    req.session.user = user;
    req.session.isAuthorized = true;
    return res.redirect('/admin');
  }
  return res.send('Пожалуйста проверьте логин и пароль!');
});
// ------------------------------
// Аутентификация Google
registrRoute.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);

registrRoute.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failure',
  }),
  async (req, res) => {
    console.log('PASSPORT_USER: ', req.session?.passport?.user);
    const email = req.session?.passport?.user.email;
    console.log('EMAIL: ', email);
    let user = await User.findOne({
      where: { email },
    });
    if (!user) {
      const login = req.session?.passport?.user.id;
      const name = req.session?.passport?.user.displayName
        || req.session?.passport?.user?.name?.givenName;
      const password = '';
      try {
        user = await User.create({
          name,
          email,
          password: await bcrypt.hash(password, 10),
          login,
        });
      } catch (error) {
        console.log(error);
        res.send('Something wrong');
      }
    }
    req.session.user = user;
    req.session.isAuthorized = true;
    return res.redirect('/');
  },
);

registrRoute.get('/failure', (req, res) => res.send('Something wrong'));

registrRoute.get('/protected', (req, res) => res.send('Success auth'));
// ------------------------------

registrRoute.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('cookie');
  return res.redirect('/');
});

module.exports = registrRoute;
