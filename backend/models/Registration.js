const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  contactInfo: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
