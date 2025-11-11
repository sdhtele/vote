const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  nim: {
    type: String,
    required: true
  },
  hasVoted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vote', voteSchema);