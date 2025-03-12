const { Utilisateur } = require('../models');
const bcrypt = require('bcryptjs');

const userController = {








  loginUser: async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;
        console.log("Tentative de connexion avec email:", email);
        console.log("Mot de passe fourni:", mot_de_passe); // Vérifie le mot de passe envoyé

        const user = await Utilisateur.findOne({ where: { email } });

        if (!user) {
            console.log("Utilisateur non trouvé");
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        console.log("Utilisateur trouvé:", user.email);
        console.log("Mot de passe hashé en BDD:", user.mot_de_passe);

        // Comparaison avec bcrypt
        const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        console.log("Résultat de la comparaison du mot de passe:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = user.generateToken();
        res.json({ user, token });

    } catch (error) {
        console.error('Erreur dans loginUser:', error);
        res.status(500).json({ error: error.message });
    }
  },


  registerUser: async (req, res) => {
    try {
      const { nom, prenom, email, mot_de_passe, telephone, role } = req.body;
      console.log("Mot de passe reçu:", mot_de_passe); 
  
      const newUser = await Utilisateur.create({
        nom,
        prenom,
        email,
        mot_de_passe, // Utilise directement le mot de passe brut, le hook le hashera
        telephone,
        role
      });
  
      console.log("Utilisateur créé avec ID:", newUser.id_utilisateur);
      console.log("Mot de passe réellement stocké en BDD :", newUser.mot_de_passe);
  
      const token = newUser.generateToken();
      res.status(201).json({
        message: "Utilisateur créé avec succès",
        utilisateur: {
          id: newUser.id_utilisateur,
          email: newUser.email
        },
        token
      });
  
    } catch (error) {
      console.error("Erreur dans registerUser:", error);
      res.status(500).json({ error: error.message });
    }
  },
  






















  // Obtenir tous les utilisateurs
  getAllUsers: async (req, res) => {
    try {
      const users = await Utilisateur.findAll();
      res.json(users);
    } catch (error) {
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

  
};
module.exports = userController;