const express = require('express');
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const authRoutes = require('./routes/authRoutes');
require('./database/db'); 

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));


app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');


app.use(session({
  secret: 'secret123', 
  resave: false,
  saveUninitialized: false
}));


app.use((req, res, next) => {
  res.locals.userEmail = req.session.userEmail;
  next();
});


app.use('/', authRoutes);


module.exports = app;
