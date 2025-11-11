const express = require('express');
const Image = require('../models/Image');
const Vote = require('../models/Vote');
const Settings = require('../models/Settings');
const router = express.Router();

// Get all images for voting
router.get('/images', async (req, res) => {
  try {
    const images = await Image.find({}).select('title description imageUrl votes');
    
    // Check if voting is still open
    const settings = await Settings.findOne();
    const deadline = settings ? settings.votingDeadline : null;
    const isVotingOpen = !deadline || new Date() < deadline;
    
    res.json({
      images,
      isVotingOpen,
      deadline
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit a vote
router.post('/vote', async (req, res) => {
  try {
    const { imageId, name, nim } = req.body;

    // Check if voting is still open
    const settings = await Settings.findOne();
    const deadline = settings ? settings.votingDeadline : null;
    
    if (deadline && new Date() >= deadline) {
      return res.status(400).json({ message: 'Voting deadline has passed' });
    }

    // Validate required fields
    if (!name || !nim || !imageId) {
      return res.status(400).json({ message: 'Name, NIM, and image ID are required' });
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({ nim: nim });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted' });
    }

    // Validate image exists
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Create vote
    const vote = new Vote({
      imageId,
      name,
      nim
    });

    await vote.save();

    // Update image vote count
    await Image.findByIdAndUpdate(imageId, { $inc: { votes: 1 } });

    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current voting results
router.get('/results', async (req, res) => {
  try {
    const results = await Image.find({}).select('title imageUrl votes').sort({ votes: -1 });
    
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
    
    // Check if voting is still open
    const settings = await Settings.findOne();
    const deadline = settings ? settings.votingDeadline : null;
    const isVotingOpen = !deadline || new Date() < deadline;
    
    res.json({
      results: resultsWithPercentages,
      totalVotes,
      isVotingOpen,
      deadline
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;