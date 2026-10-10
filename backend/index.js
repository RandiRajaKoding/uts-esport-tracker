const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Tournament = require('./models/Tournament');
const Talent = require('./models/Talent');
const Registration = require('./models/Registration');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public')); // Sajikan folder public untuk foto profil


// Koneksi ke MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI && !MONGO_URI.includes('tempel_link_mongodb')) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Terhubung ke Database MongoDB Atlas!'))
    .catch((err) => console.error('❌ Gagal terhubung ke MongoDB:', err.message));
} else {
  console.log('⚠️ MONGO_URI belum diatur dengan benar di file .env');
}

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: "Selamat datang di API TarkamHub / Esport Talent Tracker!" });
});

// ================= RUTE TURNAMEN =================
// 1. Ambil semua turnamen
app.get('/api/tournaments', async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Tambah turnamen baru
app.post('/api/tournaments', async (req, res) => {
  try {
    const { title, game, prize, status, organizer } = req.body;
    const newTournament = new Tournament({ title, game, prize, status, organizer });
    await newTournament.save();
    res.status(201).json(newTournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. Update turnamen
app.put('/api/tournaments/:id', async (req, res) => {
  try {
    const { title, game, prize, status, organizer } = req.body;
    const updatedTournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      { title, game, prize, status, organizer },
      { new: true }
    );
    res.json(updatedTournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Hapus turnamen
app.delete('/api/tournaments/:id', async (req, res) => {
  try {
    await Tournament.findByIdAndDelete(req.params.id);
    res.json({ message: "Turnamen berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Pendaftaran Turnamen (Registrasi Tim)
app.post('/api/registrations', async (req, res) => {
  try {
    const { tournamentId, teamName, contactInfo } = req.body;
    const newReg = new Registration({ tournamentId, teamName, contactInfo });
    await newReg.save();
    res.status(201).json({ message: "Pendaftaran Berhasil!", data: newReg });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ================= RUTE TALENT (CASTER) =================
// 1. Ambil semua caster
app.get('/api/talents', async (req, res) => {
  try {
    const talents = await Talent.find().sort({ createdAt: -1 });
    res.json(talents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Tambah caster baru
app.post('/api/talents', async (req, res) => {
  try {
    const { name, gameSpecialty, ratePerMatch, portfolioUrl, imageUrl } = req.body;
    const newTalent = new Talent({ name, gameSpecialty, ratePerMatch, portfolioUrl, imageUrl });
    await newTalent.save();
    res.status(201).json(newTalent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ================= SEED DATA OTOMATIS (UNTUK DUMMY AWAL) =================
app.get('/api/seed', async (req, res) => {
  try {
    await Tournament.deleteMany({});
    await Talent.deleteMany({});

    const dummyTournaments = await Tournament.insertMany([
      { title: "MLBB Student Championship Season 1", game: "Mobile Legends", prize: "Rp 5.000.000", status: "Open", organizer: "BEM FPMIPA" },
      { title: "Valorant Rookie Clash 2026", game: "Valorant", prize: "Rp 3.500.000", status: "Open", organizer: "Komunitas Valorant Kampus" },
      { title: "PUBGM Tarkam Battle Night", game: "PUBG Mobile", prize: "Rp 2.000.000", status: "Closed", organizer: "Esport Bandung" }
    ]);

    const dummyTalents = await Talent.insertMany([
      { name: "Pak Pulung", gameSpecialty: "Mobile Legends", ratePerMatch: 15000000, portfolioUrl: "https://youtube.com", imageUrl: "http://localhost:5000/public/pulung.png" },
      { name: "KB", gameSpecialty: "Mobile Legends", ratePerMatch: 18500000, portfolioUrl: "https://youtube.com", imageUrl: "http://localhost:5000/public/kb.png" },
      { name: "Nevinne", gameSpecialty: "Mobile Legends", ratePerMatch: 12000000, portfolioUrl: "https://youtube.com", imageUrl: "http://localhost:5000/public/nevinne.png" },
      { name: "Son", gameSpecialty: "Valorant", ratePerMatch: 16000000, portfolioUrl: "https://youtube.com", imageUrl: "http://localhost:5000/public/son.png" },
      { name: "Bredel", gameSpecialty: "Valorant", ratePerMatch: 14000000, portfolioUrl: "https://youtube.com", imageUrl: "http://localhost:5000/public/bredel.png" },
      { name: "Dave", gameSpecialty: "Valorant", ratePerMatch: 13500000, portfolioUrl: "https://youtube.com", imageUrl: "http://localhost:5000/public/dave.png" }
    ]);

    res.json({
      message: "Data contoh berhasil ditambahkan ke database MongoDB!",
      tournaments: dummyTournaments,
      talents: dummyTalents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`);
});
