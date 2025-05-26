const { validationResult } = require('express-validator');
const { DevisProduits, Devis, Produit } = require('../models');
const { sequelize } = require('../config/database');

const devisProduitsController = {
  // Get all DevisProduits
  getAllDevisProduits: async (req, res) => {
    try {
      const devisProduits = await DevisProduits.findAll({
        include: [
          {
            model: Devis,
            attributes: ['id_devis', 'date_creation', 'montant_estime', 'montant_final', 'statut']
          },
          {
            model: Produit,
            attributes: ['id_produit', 'nom', 'prix', 'unite_mesure']
          }
        ]
      });
      
      res.json({ 
        status: 'success', 
        message: 'DevisProduits retrieved', 
        data: devisProduits 
      });
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération des devisProduits:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  // Get DevisProduits by IDs (id_devis and id_produit)
  getDevisProduitsByIds: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    try {
      const { id_devis, id_produit } = req.params;
      
      const devisProduits = await DevisProduits.findOne({
        where: { id_devis, id_produit },
        include: [
          {
            model: Devis,
            attributes: ['id_devis', 'date_creation', 'montant_estime', 'montant_final', 'statut']
          },
          {
            model: Produit,
            attributes: ['id_produit', 'nom', 'prix', 'unite_mesure']
          }
        ]
      });
      
      if (!devisProduits) {
        return res.status(404).json({ 
          status: 'fail', 
          message: 'DevisProduits not found' 
        });
      }
      
      res.json({ 
        status: 'success', 
        message: 'DevisProduits retrieved', 
        data: devisProduits 
      });
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération du devisProduits:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  // Create DevisProduits
  createDevisProduits: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const t = await sequelize.transaction();

    try {
      const { id_devis, id_produit, quantite } = req.body;
      
      // Vérifier si le devis existe
      const devis = await Devis.findByPk(id_devis, { transaction: t });
      if (!devis) {
        await t.rollback();
        return res.status(404).json({ 
          status: 'fail', 
          message: 'Devis not found' 
        });
      }
      
      // Vérifier si le produit existe
      const produit = await Produit.findByPk(id_produit, { transaction: t });
      if (!produit) {
        await t.rollback();
        return res.status(404).json({ 
          status: 'fail', 
          message: 'Produit not found' 
        });
      }
      
      // Vérifier si l'association existe déjà
      const existingAssociation = await DevisProduits.findOne({
        where: { id_devis, id_produit },
        transaction: t
      });
      
      if (existingAssociation) {
        await t.rollback();
        return res.status(400).json({ 
          status: 'fail', 
          message: 'This association already exists' 
        });
      }
      
      // Créer l'association
      const devisProduits = await DevisProduits.create({
        id_devis,
        id_produit,
        quantite
      }, { transaction: t });
      
      await t.commit();
      
      try {
        // Récupérer l'association avec les relations
        const newDevisProduits = await DevisProduits.findOne({
          where: { id_devis, id_produit },
          include: [
            {
              model: Devis,
              attributes: ['id_devis', 'date_creation', 'montant_estime', 'montant_final', 'statut']
            },
            {
              model: Produit,
              attributes: ['id_produit', 'nom', 'prix', 'unite_mesure']
            }
          ]
        });
        
        res.status(201).json({ 
          status: 'success', 
          message: 'DevisProduits created', 
          data: newDevisProduits 
        });
      } catch (fetchError) {
        // Si erreur lors de la récupération des données après commit, on retourne quand même une réponse positive
        console.error('Erreur lors de la récupération des données après création:', fetchError);
        res.status(201).json({ 
          status: 'success', 
          message: 'DevisProduits created, but unable to fetch complete data', 
          data: { id_devis, id_produit, quantite }
        });
      }
    } catch (error) {
      // On vérifie si la transaction n'est pas déjà terminée avant de faire un rollback
      if (t && !t.finished) {
        await t.rollback();
      }
      console.error('Erreur détaillée lors de la création du devisProduits:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  // Update DevisProduits
  updateDevisProduits: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const t = await sequelize.transaction();

    try {
      const { id_devis, id_produit } = req.params;
      const { quantite } = req.body;
      
      // Vérifier si l'association existe
      const devisProduits = await DevisProduits.findOne({
        where: { id_devis, id_produit },
        transaction: t
      });
      
      if (!devisProduits) {
        await t.rollback();
        return res.status(404).json({ 
          status: 'fail', 
          message: 'DevisProduits not found' 
        });
      }
      
      // Mettre à jour l'association
      await devisProduits.update({ quantite }, { transaction: t });
      
      await t.commit();
      
      try {
        // Récupérer l'association mise à jour avec les relations
        const updatedDevisProduits = await DevisProduits.findOne({
          where: { id_devis, id_produit },
          include: [
            {
              model: Devis,
              attributes: ['id_devis', 'date_creation', 'montant_estime', 'montant_final', 'statut']
            },
            {
              model: Produit,
              attributes: ['id_produit', 'nom', 'prix', 'unite_mesure']
            }
          ]
        });
        
        res.json({ 
          status: 'success', 
          message: 'DevisProduits updated', 
          data: updatedDevisProduits 
        });
      } catch (fetchError) {
        // Si erreur lors de la récupération des données après commit, on retourne quand même une réponse positive
        console.error('Erreur lors de la récupération des données après mise à jour:', fetchError);
        res.json({ 
          status: 'success', 
          message: 'DevisProduits updated, but unable to fetch complete data', 
          data: { id_devis, id_produit, quantite }
        });
      }
    } catch (error) {
      // On vérifie si la transaction n'est pas déjà terminée avant de faire un rollback
      if (t && !t.finished) {
        await t.rollback();
      }
      console.error('Erreur détaillée lors de la mise à jour du devisProduits:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  // Delete DevisProduits
  deleteDevisProduits: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    try {
      const { id_devis, id_produit } = req.params;
      
      // Vérifier si l'association existe
      const devisProduits = await DevisProduits.findOne({
        where: { id_devis, id_produit }
      });
      
      if (!devisProduits) {
        return res.status(404).json({ 
          status: 'fail', 
          message: 'DevisProduits not found' 
        });
      }
      
      // Supprimer l'association
      await devisProduits.destroy();
      
      res.json({ 
        status: 'success', 
        message: 'DevisProduits deleted' 
      });
    } catch (error) {
      console.error('Erreur détaillée lors de la suppression du devisProduits:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  // Get all products for a specific devis
  getProductsByDevisId: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    try {
      const { id_devis } = req.params;
      
      // Vérifier si le devis existe
      const devis = await Devis.findByPk(id_devis);
      if (!devis) {
        return res.status(404).json({ 
          status: 'fail', 
          message: 'Devis not found' 
        });
      }
      
      // Récupérer tous les produits associés au devis
      const devisProduits = await DevisProduits.findAll({
        where: { id_devis },
        include: [
          {
            model: Produit,
            attributes: ['id_produit', 'nom', 'prix', 'unite_mesure']
          }
        ]
      });
      
      res.json({ 
        status: 'success', 
        message: 'Products retrieved', 
        data: devisProduits 
      });
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération des produits du devis:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  // Get all devis for a specific product
  getDevisByProductId: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    try {
      const { id_produit } = req.params;
      
      // Vérifier si le produit existe
      const produit = await Produit.findByPk(id_produit);
      if (!produit) {
        return res.status(404).json({ 
          status: 'fail', 
          message: 'Produit not found' 
        });
      }
      
      // Récupérer tous les devis associés au produit
      const devisProduits = await DevisProduits.findAll({
        where: { id_produit },
        include: [
          {
            model: Devis,
            attributes: ['id_devis', 'date_creation', 'montant_estime', 'montant_final', 'statut']
          }
        ]
      });
      
      res.json({ 
        status: 'success', 
        message: 'Devis retrieved', 
        data: devisProduits 
      });
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération des devis du produit:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Server error', 
        error: error.message 
      });
    }
  }
};

module.exports = devisProduitsController; 