const { validationResult } = require('express-validator');
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
      res.json({ status: 'success', message: 'Projets retrieved', data: projets });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  getProjetById: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

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
        return res.status(404).json({ status: 'fail', message: 'Projet non trouvé' });
      }
      res.json({ status: 'success', message: 'Projet retrieved', data: projet });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  createProjet: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const utilisateur = await Utilisateur.findByPk(req.body.id_utilisateur);
      if (!utilisateur) {
        return res.status(404).json({ status: 'fail', message: 'Utilisateur non trouvé' });
      }

      const projet = await Projet.create(req.body);
      res.status(201).json({ status: 'success', message: 'Projet created', data: projet });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  updateProjet: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const projet = await Projet.findByPk(req.params.id);
      if (!projet) {
        return res.status(404).json({ status: 'fail', message: 'Projet non trouvé' });
      }
      await projet.update(req.body);
      res.json({ status: 'success', message: 'Projet updated', data: projet });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  deleteProjet: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const projet = await Projet.findByPk(req.params.id);
      if (!projet) {
        return res.status(404).json({ status: 'fail', message: 'Projet non trouvé' });
      }
      await projet.destroy();
      res.json({ status: 'success', message: 'Projet supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  }
};

module.exports = projetController; 