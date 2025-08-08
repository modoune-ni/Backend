const mongoose = require('mongoose');

// Définition du schéma de l'article
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Le titre est obligatoire
  },
  content: {
    type: String,
    required: true, // Le contenu est obligatoire
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, // Référence à un utilisateur
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId, // Utilisateurs qui ont liké
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId, // Utilisateurs qui ont disliké
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now, // Date de création par défaut
  }
});

// Export du modèle Article
module.exports = mongoose.model('Article', articleSchema);