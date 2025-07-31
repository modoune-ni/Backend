const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();


//connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('bienvenue sur backend de l\'application');
});

// portroute Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// start the server
app.listen(PORT, () => {
  console.log(`Serveur en ecoute sur le port ${PORT}`);
});