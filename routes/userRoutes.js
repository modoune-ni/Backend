const express = require('express');
const router = express.Router();

//  CORRECTION : C majuscule dans le nom du fichier
const authController = require('../controllers/authcontrollers');

//  Middleware de protection (à créer si pas encore fait)
const { protect } = require('../middleware/authMiddleware');

//  Route : récupérer le profil utilisateur connecté
router.get('/profile', protect, authController.getUserProfile);

// Route : récupérer les articles de l'utilisateur connecté
router.get('/articles', protect, authController.getUserArticles);

module.exports = router;
