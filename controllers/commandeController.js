const { validationResult } = require('express-validator');
const { Commande } = require('../models');

const commandeController = {
  getAllCommandes: async (req, res) => {
    try {
      const commandes = await Commande.findAll();
      res.json({ status: 'success', message: 'Commandes retrieved', data: commandes });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  getCommandeById: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const commande = await Commande.findByPk(req.params.id);
      if (!commande) {
        return res.status(404).json({ status: 'fail', message: 'Commande not found' });
      }
      res.json({ status: 'success', message: 'Commande retrieved', data: commande });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  createCommande: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const commande = await Commande.create(req.body);
      res.status(201).json({ status: 'success', message: 'Commande created', data: commande });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  updateCommande: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const commande = await Commande.findByPk(req.params.id);
      if (!commande) {
        return res.status(404).json({ status: 'fail', message: 'Commande not found' });
      }
      await commande.update(req.body);
      res.json({ status: 'success', message: 'Commande updated', data: commande });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  deleteCommande: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const commande = await Commande.findByPk(req.params.id);
      if (!commande) {
        return res.status(404).json({ status: 'fail', message: 'Commande not found' });
      }
      await commande.destroy();
      res.json({ status: 'success', message: 'Commande deleted' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  }
};

module.exports = commandeController;