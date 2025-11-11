const express = require('express');
const upload = require('../middleware/upload');
const Image = require('../models/Image');
const Vote = require('../models/Vote');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all images
router.get('/images', auth, async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new image
router.post('/images', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const newImage = new Image({
      title,
      description,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
      votes: 0
    });

    const image = await newImage.save();
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete image
router.delete('/images/:id', auth, async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all votes
router.get('/votes', auth, async (req, res) => {
  try {
    const votes = await Vote.find().populate('imageId').sort({ createdAt: -1 });
    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get voting results
router.get('/results', auth, async (req, res) => {
  try {
    const results = await Image.find({}).select('title description imageUrl votes').sort({ votes: -1 });
    
    // Calculate total votes
    const totalVotes = results.reduce((sum, image) => sum + image.votes, 0);
    
    // Add percentage calculation to each image
    const resultsWithPercentages = results.map(image => {
      const percentage = totalVotes > 0 ? (image.votes / totalVotes) * 100 : 0;
      return {
        ...image.toObject(),
        percentage: Math.round(percentage * 100) / 100 // Round to 2 decimal places
      };
    });
    
    res.json({
      results: resultsWithPercentages,
      totalVotes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get voting settings
router.get('/settings', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if they don't exist
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update voting settings
router.post('/settings', auth, async (req, res) => {
  try {
    const { votingDeadline } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    
    if (votingDeadline) {
      settings.votingDeadline = new Date(votingDeadline);
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;