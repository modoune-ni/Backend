const Comment = require('../models/Comment');
const Article = require('../models/Article');

// ✅ Ajouter un commentaire à un article
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body; // 🟢 Récupère le commentaire (champ "text" attendu)
    const articleId = req.params.articleId;

    if (!text) {
      return res.status(400).json({ message: "Le champ 'text' est requis." });
    }

    // Vérifie que l'article existe
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    // Crée le commentaire
    const comment = new Comment({
      text,
      article: articleId,
      author: req.user._id
    });

    await comment.save();

    res.status(201).json({ message: 'Commentaire ajouté', comment });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// ✅ Récupérer tous les commentaires d’un article
exports.getArticleComments = async (req, res) => {
  try {
    const articleId = req.params.articleId;

    const comments = await Comment.find({ article: articleId })
      .populate('author', 'name email')  // Affiche nom + email de l'auteur
      .sort({ createdAt: -1 });          // Commentaires les plus récents

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// ✅ Supprimer un commentaire
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce commentaire' });
    }

    await comment.remove();
    res.status(200).json({ message: 'Commentaire supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
