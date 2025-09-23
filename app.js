const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('./database/db');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', bookRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Online Bookstore API' });
});

module.exports = app;


