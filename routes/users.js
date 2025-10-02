const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserProfile = require('../models/fileUpload');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/create_profile', (req, res) => {
  res.render('fileUpload');
});

router.post('/create_profile', upload.single('display_picture'), (req, res) => {
  const { fname, lname, technologies, email } = req.body;
  const display_picture = req.file.buffer.toString('base64'); 

  const userPr = new UserProfile({
    fname,
    lname,
    technologies,
    email,
    display_picture
  });

  userPr.save()
    .then(() => {
      res.status(200).send('Profile created successfully');
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
      res.status(500).send('Internal Server Error');
    });
});

module.exports = router;

