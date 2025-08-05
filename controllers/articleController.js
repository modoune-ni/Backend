const Article = require('../models/Article');

// Voir les articles de l'utilisateur connecté
exports.getUserArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user._id });
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un nouvel article
exports.createArticle = async (req, res) => {
  const { title, content } = req.body;

  try {
    const article = new Article({
      title,
      content,
      author: req.user._id,
    });

    await article.save();
    res.status(201).json({ message: 'Article créé', article });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création' });
  }
};

// Mettre à jour un article
exports.updateArticle = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;

  try {
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: 'Non trouvé' });
    if (article.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Non autorisé' });

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
    if (!article) return res.status(404).json({ message: 'Non trouvé' });
    if (article.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Non autorisé' });

    await article.remove();
    res.status(200).json({ message: 'Article supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
