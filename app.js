const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/api');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use('/api', authRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/my_db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

module.exports=app;

