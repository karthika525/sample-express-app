const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ejs = require('ejs');
const fs = require('fs').promises;
const nodemailer = require('nodemailer');


// Show all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('product/retrieve', { data: products, title: 'Product List' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving products');
  }
});

// Add product form
router.get('/create_product', (req, res) => {
  res.render('product/create', { error: null, title: 'Add Product' });
});

// Add product (POST)
router.post('/create_product', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const product = new Product({ name, description, price });
    await product.save();
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving product');
  }
});


router.get('/send_product_email/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "80e0589af08d46",
    pass: "2a1333ad791562"
  }
});
    const template = await fs.readFile('./views/product/product_email.ejs', 'utf8');
    const mailOptions = {
      from: 'user123@gmail.com', // Sender email address
      to: 'your_mailtrap_inbox@mailtrap.io', // Receiver email address
      subject: `New Product: ${product.name}`, // Email subject
      html: ejs.render(template, { product }) // Render HTML using EJS
    };


    const info = await transport.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    transport.close();
    res.send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;








