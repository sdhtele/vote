const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  votingDeadline: {
    type: Date,
    default: () => {
      // Default to 7 days from now
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);