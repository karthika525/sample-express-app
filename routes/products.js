const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const fs = require('fs').promises;
const nodemailer = require('nodemailer');

const products = {
  '1': { name: 'Bluetooth Speaker', description: 'Wireless and portable.', price: '$25' },
  '2': { name: 'Smart Watch', description: 'Tracks fitness.', price: '$99' },
  '3': { name: 'Wireless Earbuds', description: 'Noise cancelling.', price: '$49' }
};

// Show all products
router.get('/', (req, res) => {
  try {
    res.render('product/retrieve', {
      data: Object.entries(products).map(([id, p]) => ({ _id: id, ...p })),
      title: 'Product List'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving products');
  }
});

// Send product email
router.get('/send_product_email/:id', async (req, res) => {
  try {
    const product = products[req.params.id];
    if (!product) {
      return res.status(404).send('Product not found');
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "80e0589af08d46",
        pass: "2a1333ad791562"
      }
    });

    const template = await fs.readFile('./views/product/product_email.ejs', 'utf8');

    const mailOptions = {
      from: 'user123@gmail.com',
      to: 'your_mailtrap_inbox@mailtrap.io',
      subject: `New Product: ${product.name}`,
      html: ejs.render(template, { product })
    };

    const info = await transport.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    transport.close();
    res.send(`Email for ${product.name} sent successfully`);
  } catch (error) {
    console.error(' Error sending email:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
