const { Projet, Utilisateur, Media } = require('../models');

const projetController = {
  getAllProjets: async (req, res) => {
    try {
      const projets = await Projet.findAll({
        include: [{
          model: Utilisateur,
          attributes: ['nom', 'prenom', 'email']
        },
        {
          model: Media,
          as: 'medias',
          attributes: ['url']
        }
      ]
      });
      res.json(projets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProjetById: async (req, res) => {
    try {
      const projet = await Projet.findByPk(req.params.id, {
        include: [{
          model: Utilisateur,
          attributes: ['nom', 'prenom', 'email']
        },
        {
          model: Media,
          as: 'medias',
          attributes: ['url']
        }
      ]
      });
      if (!projet) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }
      res.json(projet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createProjet: async (req, res) => {
    try {
      const projet = await Projet.create(req.body);
      res.status(201).json(projet);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateProjet: async (req, res) => {
    try {
      const projet = await Projet.findByPk(req.params.id);
      if (!projet) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }
      await projet.update(req.body);
      res.json(projet);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteProjet: async (req, res) => {
    try {
      const projet = await Projet.findByPk(req.params.id);
      if (!projet) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }
      await projet.destroy();
      res.json({ message: 'Projet supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = projetController; 