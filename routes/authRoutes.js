const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const articleController = require('../controllers/articleController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const commentController = require('../controllers/commentController');

// ✅ Route test simple
router.get('/test-like', (req, res) => {
  res.send("Test Like");
});


// 🔐 ROUTES PUBLIQUES
router.post('/register', authController.registerUser);  // Inscription
router.post('/login', authController.loginUser);        // Connexion

// 🔐 ROUTES PROTÉGÉES PAR TOKEN
router.put('/profile', protect, authController.updateUserProfile); // Modifier profil
router.get('/profile', protect, authController.getUserProfile);    // Récupérer son profil
router.get('/all-profiles', protect, authController.getAllUsers);  // Liste tous les profils (admin)

// 📝 GESTION DES ARTICLES
router.get('/articles', protect, articleController.getUserArticles);     // Récupérer articles de l'utilisateur
router.post('/articles', protect, articleController.createArticle);      // Créer article
router.put('/articles/:id', protect, articleController.updateArticle);   // Modifier article
router.delete('/articles/:id', protect, articleController.deleteArticle); // Supprimer article

// 👍👎 LIKES & DISLIKES
router.post('/articles/:id/like', protect, articleController.likeArticle);     // Liker un article
router.post('/articles/:id/dislike', protect, articleController.dislikeArticle); // Disliker un article

// 📷 AVATAR
router.put('/profile/avatar', protect, upload.single('avatar'), authController.updateAvatar); // Mettre à jour avatar

// 💬 Ajouter un commentaire à un article
router.post('/articles/:articleId/comments', protect, commentController.addComment);

// 💬 Voir les commentaires d’un article
router.get('/articles/:articleId/comments', protect, commentController.getArticleComments);


// 🔓 DÉCONNEXION
router.post('/logout', protect, authController.logoutUser); // Déconnexion (symbolique côté client)

module.exports = router;
