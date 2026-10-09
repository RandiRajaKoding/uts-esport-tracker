const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  game: { type: String, required: true }, // contoh: MLBB, Valorant
  prize: { type: String, required: true },
  status: { type: String, default: 'Open' }, // Open, Ongoing, Completed
  organizer: { type: String }, 
}, { timestamps: true }); // otomatis membuat createdAt & updatedAt

module.exports = mongoose.model('Tournament', tournamentSchema);
