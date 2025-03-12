const { Utilisateur } = require('../models');
const bcrypt = require('bcryptjs');

const userController = {
  // Obtenir tous les utilisateurs
  getAllUsers: async (req, res) => {
    try {
      const users = await Utilisateur.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // connexion et retour du JWT
  loginUser: async (req, res) => {
    try {
      
      const { email, mot_de_passe } = req.body;
      console.log('==================================================');
      console.log('Mot de passe:', mot_de_passe);
      
      const user = await Utilisateur.findOne({ where: { email } });
      console.log('Mot de passe BDD:', user.mot_de_passe);      
      if (!user) {
        console.log('Aucun utilisateur trouvé');
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const isPasswordValid = await user.comparePassword(mot_de_passe);
      console.log('Mot de passe valide:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('Mot de passe incorrect');
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const token = user.generateToken();
      console.log('Token généré:', token);
      
      res.json({ user, token });
    } catch (error) {
      console.error('Erreur dans loginUser:', error);
      res.status(500).json({ error: error.message });
    }
  },

  //voir le profil d'un utilisatuer
  getProfile: async (req, res) => {
    try {
      const user = await Utilisateur.findByPk(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Méthode pour enregistrer un nouvel utilisateur
  registerUser: async (req, res) => {
    try {
      const { nom, prenom, email, mot_de_passe, telephone, role } = req.body;
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10); // Hashage du mot de passe

      const newUser = await Utilisateur.create({
        nom,
        prenom,
        email,
        mot_de_passe: hashedPassword,
        telephone,
        role
      });

      res.status(201).json({
        message: "Utilisateur créé avec succès",
        utilisateur: {
          id: newUser.id_utilisateur,
          email: newUser.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;