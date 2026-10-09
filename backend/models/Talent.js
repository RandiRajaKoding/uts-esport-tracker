const mongoose = require('mongoose');

const talentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gameSpecialty: { type: String, required: true }, // Spesialis game (MLBB, PUBGM)
  ratePerMatch: { type: Number, required: true },  // Harga per match (angka)
  portfolioUrl: { type: String },                  // Link YouTube/Tiktok
  imageUrl: { type: String },                      // Link Foto Profil
}, { timestamps: true });

module.exports = mongoose.model('Talent', talentSchema);
