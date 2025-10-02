const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const productRoutes = require('./routes/products'); 

const app = express();


app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
  res.send('<a href="/products//">Click here for Product List</a>');
});
app.use('/products', productRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/prodctDB')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

module.exports=app;

