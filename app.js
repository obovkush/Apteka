require('dotenv').config();
require('./config/passport-google');
const express = require('express');
const passport = require('passport');
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');

let https;
try {
  https = require('https');
} catch (err) {
  console.log('https support is disabled!');
}
const app = express();
const PORT = process.env.PORT ?? 3000;
const PORT_HTTPS = process.env.PORT_HTTPS ?? 3001;
const cookieParser = require('cookie-parser'); // библиотека необходимая для чтения дынных с куки
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);
const dbConnectionCheck = require('./db/dbConnectionCheck');
const isAuthorized = require('./middleware/isAuthorized');
const indexRoute = require('./routes/index');
const registrRoute = require('./routes/users/registr');
const profileRoute = require('./routes/users/profile');
const basketRoute = require('./routes/basket');
const adminRoute = require('./routes/users/admin');

// для сохранности сессий в наших данных
const sessionConfig = {
  name: 'cookie',
  store: new FileStore(), // добавить после установки session-file-store
  secret: 'keyboard cat',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // устанавливаем сколько живет кука
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: false,
};

require('./routes/users/passport')(passport);

app.use(expressSession(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(isAuthorized);
app.use('/', indexRoute);
app.use('/', registrRoute);
app.use('/profile', profileRoute);
app.use('/', basketRoute);
app.use('/', adminRoute);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
dbConnectionCheck();
https
  .createServer(
    // Provide the private and public key to the server by reading each
    // file's content with the readFileSync() method.
    {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
    },
    app
  )
  .listen(PORT_HTTPS, (req, res) => {
    console.log('Сервер стартовал по протоколу HTTPS, порт:', PORT_HTTPS);
  });

app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(PORT, (req, res) => {
  console.log('Сервер стартовал по протоколу HTTP, порт:', PORT);
});
