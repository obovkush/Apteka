const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'jovani.hilpert36@ethereal.email',
    pass: '2Hahh8ZNvzzX1RQrvu',
  },
  from: 'Apteka <jovani.hilpert36@ethereal.email>',
});

const mailer = (message) => {
  // eslint-disable-next-line consistent-return
  transporter.sendMail(message, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('сообщение отправлено', info);
  });
};

module.exports = mailer;
