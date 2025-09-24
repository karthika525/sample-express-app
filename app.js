const express = require('express');
const mongoose = require('mongoose');
const api= require('./routes/api');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use('/api', api);
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/my_db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));




app.get('/', (req, res) => {
  res.json({ message: "Simple Login API running" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

module.exports=app;

