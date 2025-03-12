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
      res.json(produits);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProduitById: async (req, res) => {
    try {
      const produit = await Produit.findByPk(req.params.id, {
        include: [{
          model: CatalogueFournisseurs,
          attributes: ['nom_fournisseur', 'categorie']
        }]
      });
      if (!produit) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
      res.json(produit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createProduit: async (req, res) => {
    try {
      const produit = await Produit.create(req.body);
      res.status(201).json(produit);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateProduit: async (req, res) => {
    try {
      const produit = await Produit.findByPk(req.params.id);
      if (!produit) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
      await produit.update(req.body);
      res.json(produit);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteProduit: async (req, res) => {
    try {
      const produit = await Produit.findByPk(req.params.id);
      if (!produit) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
      await produit.destroy();
      res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = produitController; 