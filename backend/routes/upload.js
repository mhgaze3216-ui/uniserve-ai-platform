const express = require('express');
const path = require('path');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const fs = require('fs');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);

const ensureDir = async (dir) => {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};

ensureDir('uploads');
ensureDir('uploads/avatars');
ensureDir('uploads/courses');
ensureDir('uploads/marketplace');

router.post('/avatar', auth, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/avatars/${req.file.filename}`;
    
    res.json({
      message: 'Avatar uploaded successfully',
      fileUrl: fileUrl
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

router.post('/course-image', auth, upload.single('courseImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/courses/${req.file.filename}`;
    
    res.json({
      message: 'Course image uploaded successfully',
      fileUrl: fileUrl
    });
  } catch (error) {
    console.error('Course image upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

router.post('/marketplace-images', auth, upload.array('marketplaceImages', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const fileUrls = req.files.map(file => `/uploads/marketplace/${file.filename}`);
    
    res.json({
      message: 'Marketplace images uploaded successfully',
      fileUrls: fileUrls
    });
  } catch (error) {
    console.error('Marketplace images upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
