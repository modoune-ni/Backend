const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontrollers'); // attention au nom du fichier (c minuscule)
const articleController = require('../controllers/articleController');
const protect = require('../middleware/authMiddleware');

// Routes publiques
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Routes protégées
router.put('/profile', protect, authController.updateUserProfile);  // modifier profil
router.get('/profile', protect, authController.getUserProfile);     // récupérer profil
router.get('/all-profiles', protect, authController.getAllUsers);  // 👈 nouvelle route

// Routes protégées
router.get('/articles', protect, articleController.getUserArticles); // récupérer articles de l'utilisateur connecté
router.post('/articles', protect, articleController.createArticle); // créer un nouvel article
router.put('/articles/:id', protect, articleController.updateArticle); // mettre à jour un article
router.delete('/articles/:id', protect, articleController.deleteArticle); // supprimer un article

// Déconnexion (symbolique, côté client on supprime le token)
router.post('/logout', protect, authController.logoutUser);

module.exports = router;
