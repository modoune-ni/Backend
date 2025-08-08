const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// 🔗 Connexion MongoDB
connectDB();

// ✅ Middleware CORS avec options
const corsOptions = {
  origin: '*', // ou 'http://192.168.1.X:5173' si tu veux restreindre
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());


app.use('/uploads', express.static('uploads'));

//server les images statiques
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ✅ Routes API
app.use("/api/auth", authRoutes);

app.use("/api/comments", commentRoutes);

// ✅ Route test
app.get('/', (req, res) => {
  res.send("Bienvenue sur le backend de l'application");
});

// ✅ Lancement du serveur sur toutes les interfaces
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur en écoute sur le port ${PORT}`);
});