const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {               // <-- ajout du champ bio
    type: String,
    default: ''
  },
  createDAt: {
    type: Date,
    default: Date.now
  },

  avatar: {            // <-- ajout du champ avatar
    type: String,      // URL de l'image ou chemin local
    default: ''
  }
}, { timestamps: true });

//  Middleware pour hasher le mot de passe avant save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();  // tu avais raison, il fallait bien appeler next()
  } catch (error) {
    next(error);
  }
});

//  Méthode pour comparer le mot de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;