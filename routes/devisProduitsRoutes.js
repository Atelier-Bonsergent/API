const express = require('express');
const { body, param } = require('express-validator');
const devisProduitsController = require('../controllers/devisProduitsController');
const router = express.Router();

// Validation pour les paramètres d'ID
const validateIds = [
  param('id_devis').isInt().withMessage('id_devis must be an integer'),
  param('id_produit').isInt().withMessage('id_produit must be an integer')
];

// Validation pour la création et la mise à jour
const validateDevisProduits = [
  body('id_devis').isInt().withMessage('id_devis must be an integer'),
  body('id_produit').isInt().withMessage('id_produit must be an integer'),
  body('quantite').isInt({ min: 1 }).withMessage('quantite must be a positive integer')
];

// Validation pour la mise à jour
const validateUpdateDevisProduits = [
  body('quantite').isInt({ min: 1 }).withMessage('quantite must be a positive integer')
];

// Routes
router.get('/', devisProduitsController.getAllDevisProduits);
router.get('/:id_devis/:id_produit', validateIds, devisProduitsController.getDevisProduitsByIds);
router.post('/', validateDevisProduits, devisProduitsController.createDevisProduits);
router.put('/:id_devis/:id_produit', [...validateIds, ...validateUpdateDevisProduits], devisProduitsController.updateDevisProduits);
router.delete('/:id_devis/:id_produit', validateIds, devisProduitsController.deleteDevisProduits);

// Routes supplémentaires
router.get('/devis/:id_devis/produits', param('id_devis').isInt().withMessage('id_devis must be an integer'), devisProduitsController.getProductsByDevisId);
router.get('/produit/:id_produit/devis', param('id_produit').isInt().withMessage('id_produit must be an integer'), devisProduitsController.getDevisByProductId);

module.exports = router; 