
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

require('./database/db'); 

const apiRouter = require('./routes/api');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);
app.get('/', (req, res) => {
  res.json({ message: 'Tech Store API is running. Use /api/devices' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = app;

