const express = require('express')
const app = express()
const port = 3000
const router = require('./routes/index')
const nodemailer = require('nodemailer');
const session = require('express-session');

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static('assets'));
app.use(express.static('public'))

app.use(session({
  secret: 'rahasia',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, samesite: true }
}));

app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})