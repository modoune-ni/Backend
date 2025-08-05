const User = require('../models/User');
const jwt = require('jsonwebtoken');

//  Enregistrer un utilisateur
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password, confirmPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

//  Connexion utilisateur
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'User connecté avec succès', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mise à jour du profil utilisateur
exports.updateUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const { name, email, bio } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (bio) user.bio = bio;

    await user.save();

    res.status(200).json({ message: 'Profil mis à jour avec succès', user });
  } catch (error) {
    console.error('Erreur updateUserProfile:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil' });
  }
};

//  Récupérer le profil utilisateur connecté (modifié ici)
exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Ne retourner que les champs demandés
    res.status(200).json({
      name: user.name,
      email: user.email,
      bio: user.bio || ""
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Déconnexion utilisateur
exports.logoutUser = (req, res) => {
  res.status(200).json({ message: 'Déconnecté avec succès (côté client: supprimer le token)' });
};

// Récupérer tous les profils (admin seulement idéalement)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // on exclut les mots de passe
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur getAllUsers:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const Article = require('../models/Article');

//  Créer un article
exports.createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;

    const article = new Article({
      title,
      content,
      author: req.user._id
    });

    await article.save();

    res.status(201).json({ message: 'Article créé', article });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Lister tous les articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate('author', 'name email');
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Modifier un article
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    article.title = title || article.title;
    article.content = content || article.content;

    await article.save();

    res.status(200).json({ message: 'Article mis à jour', article });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un article
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: 'Article non trouvé' });

    // Vérifie que l'article appartient à l'utilisateur connecté
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé à supprimer cet article' });
    }

    await Article.findByIdAndDelete(id);

    res.status(200).json({ message: 'Article supprimé' });
  } catch (err) {
    console.error('Erreur deleteArticle:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};



