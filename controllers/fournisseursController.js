const { validationResult } = require('express-validator');
const { Fournisseurs } = require('../models');

const fournisseursController = {
  getAll: async (req, res) => {
    try {
      const fournisseurs = await Fournisseurs.findAll();
      res.json({ status: 'success', message: 'Fournisseurs retrieved', data: fournisseurs });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  getById: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const fournisseur = await Fournisseurs.findByPk(req.params.id);
      if (!fournisseur) {
        return res.status(404).json({ status: 'fail', message: 'Fournisseur not found' });
      }
      res.json({ status: 'success', message: 'Fournisseur retrieved', data: fournisseur });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  create: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const fournisseur = await Fournisseurs.create(req.body);
      res.status(201).json({ status: 'success', message: 'Fournisseur created', data: fournisseur });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  update: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const fournisseur = await Fournisseurs.findByPk(req.params.id);
      if (!fournisseur) {
        return res.status(404).json({ status: 'fail', message: 'Fournisseur not found' });
      }
      await fournisseur.update(req.body);
      res.json({ status: 'success', message: 'Fournisseur updated', data: fournisseur });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  delete: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const fournisseur = await Fournisseurs.findByPk(req.params.id);
      if (!fournisseur) {
        return res.status(404).json({ status: 'fail', message: 'Fournisseur not found' });
      }
      await fournisseur.destroy();
      res.json({ status: 'success', message: 'Fournisseur deleted' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  }
};

module.exports = fournisseursController;