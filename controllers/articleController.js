const Article = require('../models/Article');

// 🔹 Récupérer tous les articles de l'utilisateur connecté
exports.getUserArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user._id });
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🔹 Créer un nouvel article
exports.createArticle = async (req, res) => {
  const { title, content } = req.body;

  try {
    const article = new Article({
      title,
      content,
      author: req.user._id, // Rattacher l'article à l'utilisateur connecté
    });

    await article.save();
    res.status(201).json({ message: 'Article créé', article });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création' });
  }
};

// 🔹 Modifier un article existant
exports.updateArticle = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;

  try {
    const article = await Article.findById(id);

    // Vérifie que l'article existe
    if (!article) return res.status(404).json({ message: 'Non trouvé' });

    // Vérifie que l'article appartient bien à l'utilisateur connecté
    if (article.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Non autorisé' });

    // Mise à jour
    article.title = title || article.title;
    article.content = content || article.content;
    await article.save();

    res.status(200).json({ message: 'Article mis à jour', article });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🔹 Supprimer un article
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: 'Non trouvé' });

    // Vérifie que l'utilisateur est bien l'auteur
    if (article.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Non autorisé' });

    await article.remove();
    res.status(200).json({ message: 'Article supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🔹 Liker un article
exports.likeArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: 'Article non trouvé' });

    // Empêche de liker deux fois
    if (article.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Vous avez déjà liké cet article' });
    }

    // Retire le dislike s’il existe
    if (article.dislikes.includes(req.user._id)) {
      article.dislikes.pull(req.user._id);
    }

    article.likes.push(req.user._id);
    await article.save();

    res.status(200).json({ message: 'Article liké', article });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🔹 Disliker un article
exports.dislikeArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: 'Article non trouvé' });

    // Empêche de disliker deux fois
    if (article.dislikes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Vous avez déjà disliké cet article' });
    }

    // Retire le like s’il existe
    if (article.likes.includes(req.user._id)) {
      article.likes.pull(req.user._id);
    }

    article.dislikes.push(req.user._id);
    await article.save();

    res.status(200).json({ message: 'Article disliké', article });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
