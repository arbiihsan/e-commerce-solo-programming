const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'arbiihsan@gmail.com', 
    pass: 'glbroxomjvrdvalo', 
  },
});

module.exports = transporter;