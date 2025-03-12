const { validationResult } = require('express-validator');
const { Produit, CatalogueFournisseurs } = require('../models');

const produitController = {
  getAllProduits: async (req, res) => {
    try {
      const produits = await Produit.findAll({
        include: [{
          model: CatalogueFournisseurs,
          attributes: ['nom_fournisseur', 'categorie']
        }]
      });
      res.json({ status: 'success', message: 'Produits retrieved', data: produits });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  getProduitById: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const produit = await Produit.findByPk(req.params.id, {
        include: [{
          model: CatalogueFournisseurs,
          attributes: ['nom_fournisseur', 'categorie']
        }]
      });
      if (!produit) {
        return res.status(404).json({ status: 'fail', message: 'Produit not found' });
      }
      res.json({ status: 'success', message: 'Produit retrieved', data: produit });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  createProduit: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const produit = await Produit.create(req.body);
      res.status(201).json({ status: 'success', message: 'Produit created', data: produit });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  updateProduit: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const produit = await Produit.findByPk(req.params.id);
      if (!produit) {
        return res.status(404).json({ status: 'fail', message: 'Produit not found' });
      }
      await produit.update(req.body);
      res.json({ status: 'success', message: 'Produit updated', data: produit });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  deleteProduit: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const produit = await Produit.findByPk(req.params.id);
      if (!produit) {
        return res.status(404).json({ status: 'fail', message: 'Produit not found' });
      }
      await produit.destroy();
      res.json({ status: 'success', message: 'Produit deleted' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  }
};

module.exports = produitController; 