const express = require('express');
const router = express.Router();

// ✅ Importation des contrôleurs et middlewares
const authController = require('../controllers/authController'); 
const articleController = require('../controllers/articleController');
const commentController = require('../controllers/commentController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// ✅ Route test simple
router.get('/test-like', (req, res) => {
  res.send("Test Like");
});

// 🔐 ROUTES PUBLIQUES
router.post('/register', authController.registerUser);     // Inscription
router.post('/login', authController.loginUser);           // Connexion

// 🔐 ROUTES PROTÉGÉES PAR TOKEN
router.get('/profile', protect, authController.getUserProfile);     // Récupérer son profil
router.put('/profile', protect, authController.updateUserProfile);  // Modifier son profil
router.get('/all-profiles', protect, authController.getAllUsers);   // Voir tous les profils (admin)

// 📝 GESTION DES ARTICLES
router.get('/articles', protect, articleController.getUserArticles);       // Liste des articles
router.post('/articles', protect, articleController.createArticle);        // Créer un article
router.put('/articles/:id', protect, articleController.updateArticle);     // Modifier un article
router.delete('/articles/:id', protect, articleController.deleteArticle);  // Supprimer un article

// 👍👎 LIKES & DISLIKES
router.post('/articles/:id/like', protect, articleController.likeArticle);       // Liker
router.post('/articles/:id/dislike', protect, articleController.dislikeArticle); // Disliker

// 📷 AVATAR
router.put('/profile/avatar', protect, upload.single('avatar'), authController.updateAvatar); // Modifier avatar

// 💬 COMMENTAIRES
router.post('/articles/:articleId/comments', protect, commentController.addComment);         // Ajouter un commentaire
router.get('/articles/:articleId/comments', protect, commentController.getArticleComments);  // Voir les commentaires

// 🔓 DÉCONNEXION
router.post('/logout', protect, authController.logoutUser); // Déconnexion (symbolique côté client)

module.exports = router;
