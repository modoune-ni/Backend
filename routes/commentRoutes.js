const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment'); // chemin selon ton arborescence

// 🔹 POST /api/comments/articles/:articleId
router.post('/articles/:articleId', async (req, res) => {
  const { articleId } = req.params;
  const { author, text } = req.body;

  if (!author || !text) {
    return res.status(400).json({ message: 'Champs requis manquants.' });
  }

  try {
    const newComment = new Comment({
      article: articleId,
      author,
      text
    });

    const savedComment = await newComment.save();
    res.status(201).json({ message: 'Commentaire ajouté avec succès.', comment: savedComment });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// 🔹 GET /api/comments/articles/:articleId
router.get('/articles/:articleId', async (req, res) => {
  const { articleId } = req.params;

  try {
    const comments = await Comment.find({ article: articleId })
      .populate('author', 'username') // ou d'autres champs utiles
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;