const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // Connexion base de données
const authRoutes = require('./routes/authRoutes'); // Routes de l'API

const app = express();

// 🔗 Connexion à MongoDB
connectDB();

// ✅ Middleware CORS (autorise les requêtes depuis le front)
const corsOptions = {
  origin: '*', // Autorise toutes les origines (à restreindre si besoin)
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json()); // Permet de lire les JSON dans les requêtes

// ✅ Servir les images statiques (avatars, etc.)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Route principale de l'API
app.use("/api/auth", authRoutes); // Toutes les routes sont préfixées par /api/auth

// ✅ Route simple pour test
app.get('/', (req, res) => {
  res.send("Bienvenue sur le backend de l'application");
});

// ✅ Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur en écoute sur le port ${PORT}`);
});
