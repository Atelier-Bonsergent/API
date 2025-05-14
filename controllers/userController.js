const { Utilisateur } = require('../models');
const bcrypt = require('bcryptjs');

const userController = {


  loginUser: async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;
        
        

        const user = await Utilisateur.findOne({ where: { email } });

        if (!user) {
            
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        
        

        // Comparaison avec bcrypt
        const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = user.generateToken();
        res.json({ token });

    } catch (error) {
        console.error('Erreur dans loginUser:', error);
        res.status(500).json({ error: error.message });
    }
  },


  registerUser: async (req, res) => {
    try {
      const { nom, prenom, email, mot_de_passe, telephone, role } = req.body;
      
  
      const newUser = await Utilisateur.create({
        nom,
        prenom,
        email,
        mot_de_passe,
        telephone,
        role
      });
  
      
      
  
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

  updateUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const { nom, prenom, email, telephone, mot_de_passe, ancien_mot_de_passe } = req.body;

      const user = await Utilisateur.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Préparer l'objet de mise à jour
      const updateData = {
        nom: nom || user.nom,
        prenom: prenom || user.prenom,
        email: email || user.email,
        telephone: telephone || user.telephone
      };

      // Si un nouveau mot de passe est fourni, vérifier l'ancien mot de passe
      if (mot_de_passe) {
        if (!ancien_mot_de_passe) {
          return res.status(400).json({ message: 'L\'ancien mot de passe est requis pour changer le mot de passe' });
        }

        const isPasswordValid = await bcrypt.compare(ancien_mot_de_passe, user.mot_de_passe);
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
        }

        // Hacher le nouveau mot de passe et l'ajouter à l'objet de mise à jour
        updateData.mot_de_passe = await bcrypt.hash(mot_de_passe, 10);
      }

      // Mise à jour de tous les champs en une seule opération
      await user.update(updateData);

      res.json({
        message: 'Profil mis à jour avec succès',
        utilisateur: {
          id: user.id_utilisateur,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.telephone,
          role: user.role
        }
      });

    } catch (error) {
      console.error('Erreur dans updateUser:', error);
      res.status(500).json({ error: error.message });
    }
  },

};
module.exports = userController;