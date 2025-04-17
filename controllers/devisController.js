const { validationResult } = require('express-validator');
const { Devis, Projet, Produit, DevisProduits } = require('../models');
const { sequelize } = require('../config/database');

const devisController = {
  getAllDevis: async (req, res) => {
    try {
      console.log('Début de la requête getAllDevis');
      const devis = await Devis.findAll({
        include: [
          {
            model: Projet,
            attributes: ['titre', 'description']
          },
          {
            model: Produit,
            as: 'produits',
            through: { 
              model: DevisProduits,
              attributes: ['quantite']
            },
            attributes: ['id_produit', 'nom', 'prix', 'unite_mesure']
          }
        ]
      });
      
      res.json({ status: 'success', message: 'Devis retrieved', data: devis });
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération des devis:', error);
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  getDevisById: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      console.log(`Début de la requête getDevisById pour l'ID: ${req.params.id}`);
      const devis = await Devis.findByPk(req.params.id, {
        include: [
          {
            model: Projet,
            attributes: ['titre', 'description']
          },
          {
            model: Produit,
            as: 'produits',
            through: { 
              model: DevisProduits,
              attributes: ['quantite']
            },
            attributes: ['id_produit', 'nom', 'prix', 'unite_mesure']
          }
        ],
        logging: console.log // Active les logs SQL
      });
      if (!devis) {
        console.log(`Devis avec l'ID: ${req.params.id} non trouvé`);
        return res.status(404).json({ status: 'fail', message: 'Devis not found' });
      }
      console.log('Devis trouvé:', JSON.stringify(devis, null, 2));
      res.json({ status: 'success', message: 'Devis retrieved', data: devis });
    } catch (error) {
      console.error(`Erreur détaillée lors de la récupération du devis avec l'ID: ${req.params.id}`, error);
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  createDevis: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    const t = await sequelize.transaction();

    try {
      const { produits, ...devisData } = req.body;
      const devis = await Devis.create(devisData, { transaction: t });

      if (produits && Array.isArray(produits)) {
        const produitsAssociations = produits.map(p => ({
          id_devis: devis.id_devis,
          id_produit: p.id_produit,
          quantite: p.quantite
        }));

        await DevisProduits.bulkCreate(produitsAssociations, { transaction: t });
      }

      await t.commit();

      const devisComplet = await Devis.findByPk(devis.id_devis, {
        include: [
          {
            model: Projet,
            attributes: ['titre', 'description']
          },
          {
            model: Produit,
            as: 'produits',
            through: { 
              model: DevisProduits,
              attributes: ['quantite']
            },
            attributes: ['id_produit', 'nom', 'prix', 'unite_mesure']
          }
        ]
      });

      res.status(201).json({ 
        status: 'success', 
        message: 'Devis created', 
        data: devisComplet 
      });
    } catch (error) {
      await t.rollback();
      console.error('Erreur détaillée lors de la création du devis:', error);
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  updateDevis: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    const t = await sequelize.transaction();

    try {
      const { produits, ...devisData } = req.body;
      const devis = await Devis.findByPk(req.params.id);
      
      if (!devis) {
        await t.rollback();
        return res.status(404).json({ status: 'fail', message: 'Devis not found' });
      }

      await devis.update(devisData, { transaction: t });

      if (produits && Array.isArray(produits)) {
        // Supprimer les anciennes associations
        await DevisProduits.destroy({
          where: { id_devis: devis.id_devis },
          transaction: t
        });

        // Créer les nouvelles associations
        const produitsAssociations = produits.map(p => ({
          id_devis: devis.id_devis,
          id_produit: p.id_produit,
          quantite: p.quantite
        }));

        await DevisProduits.bulkCreate(produitsAssociations, { transaction: t });
      }

      await t.commit();

      const devisUpdated = await Devis.findByPk(devis.id_devis, {
        include: [
          {
            model: Projet,
            attributes: ['titre', 'description']
          },
          {
            model: Produit,
            as: 'produits',
            through: { 
              model: DevisProduits,
              attributes: ['quantite']
            },
            attributes: ['id_produit', 'nom', 'prix', 'unite_mesure']
          }
        ]
      });

      res.json({ 
        status: 'success', 
        message: 'Devis updated', 
        data: devisUpdated 
      });
    } catch (error) {
      await t.rollback();
      console.error('Erreur détaillée lors de la mise à jour du devis:', error);
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  deleteDevis: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      console.log(`Début de la requête deleteDevis pour l'ID: ${req.params.id}`);
      const devis = await Devis.findByPk(req.params.id);
      if (!devis) {
        console.log(`Devis avec l'ID: ${req.params.id} non trouvé`);
        return res.status(404).json({ status: 'fail', message: 'Devis not found' });
      }
      await devis.destroy();
      console.log(`Devis avec l'ID: ${req.params.id} supprimé`);
      res.json({ status: 'success', message: 'Devis deleted' });
    } catch (error) {
      console.error(`Erreur détaillée lors de la suppression du devis avec l'ID: ${req.params.id}`, error);
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  }
};

module.exports = devisController;