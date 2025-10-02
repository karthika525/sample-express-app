const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ejs = require('ejs');
const fs = require('fs').promises;
const pdf = require('html-pdf-node');

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

// Generate PDF for a product
router.get('/generate-pdf/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).send('Product not found');

    const template = await fs.readFile('./views/product/product_pdf_template.ejs', 'utf8');
    const html = ejs.render(template, { product });

    const options = { format: 'A4' };
    const pdfBuffer = await pdf.generatePdf({ content: html }, options);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${product.name}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
