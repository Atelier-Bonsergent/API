const { validationResult } = require('express-validator');
const { Devis, Projet, DetailDevis, Produit } = require('../models');

const devisController = {
  getAllDevis: async (req, res) => {
    try {
      const devis = await Devis.findAll({
        include: [
          { model: Projet },
          { model: Produit, as: 'produit' }
        ]
      });
      res.json({ status: 'success', message: 'Devis retrieved', data: devis });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  getDevisById: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const devis = await Devis.findByPk(req.params.id, {
        include: [
          { model: Projet },
          { model: Produit, as: 'produit' }
        ]
      });
      if (!devis) {
        return res.status(404).json({ status: 'fail', message: 'Devis not found' });
      }
      res.json({ status: 'success', message: 'Devis retrieved', data: devis });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  createDevis: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const devis = await Devis.create(req.body);
      res.status(201).json({ status: 'success', message: 'Devis created', data: devis });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  updateDevis: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const devis = await Devis.findByPk(req.params.id);
      if (!devis) {
        return res.status(404).json({ status: 'fail', message: 'Devis not found' });
      }
      await devis.update(req.body);
      res.json({ status: 'success', message: 'Devis updated', data: devis });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  deleteDevis: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const devis = await Devis.findByPk(req.params.id);
      if (!devis) {
        return res.status(404).json({ status: 'fail', message: 'Devis not found' });
      }
      await devis.destroy();
      res.json({ status: 'success', message: 'Devis deleted' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  }
};

module.exports = devisController;