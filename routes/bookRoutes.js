const express = require('express');
const router = express.Router();
const Book = require('../models/bookModel');

router.post('/books', async (req, res) => {
  try {
    let { title, author, price, inStock } = req.body;

   
    if (typeof inStock === 'string') {
      inStock = inStock.toLowerCase() === 'yes';
    }

    const book = new Book({ title, author, price, inStock });
    await book.save();

    res.status(201).json({ message: 'Book added successfully', data: book });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

router.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json({ data: books });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/books/:id', async (req, res) => {
  try {
    let { title, author, price, inStock } = req.body;
    if (typeof inStock === 'string') {
      inStock = inStock.toLowerCase() === 'yes';
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, price, inStock },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book updated successfully', data: updatedBook });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

router.delete('/books/:id', async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
