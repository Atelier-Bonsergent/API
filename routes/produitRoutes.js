const express = require('express');
const { body, param } = require('express-validator');
const produitController = require('../controllers/produitController');

const router = express.Router();

// Validation rules for creating a product
const produitValidationRules = [
    body('nom').isString().withMessage('Nom doit être une chaîne de caractères'),
    body('categorie').isString().withMessage('Catégorie doit être une chaîne de caractères'),
    body('prix').isDecimal({ decimal_digits: '0,2' }).withMessage('Prix doit être un nombre décimal positif'),
    body('quantite').isInt({ min: 0 }).withMessage('Quantité doit être un entier non négatif'),
    body('unite_mesure').isString().withMessage('Unité de mesure doit être une chaîne de caractères')
];

// Validation rules for updating a product
const produitUpdateValidationRules = [
    body('nom').optional().isString().withMessage('Nom doit être une chaîne de caractères'),
    body('categorie').optional().isString().withMessage('Catégorie doit être une chaîne de caractères'),
    body('prix').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Prix doit être un nombre décimal positif'),
    body('quantite').optional().isInt({ min: 0 }).withMessage('Quantité doit être un entier non négatif'),
    body('unite_mesure').optional().isString().withMessage('Unité de mesure doit être une chaîne de caractères')
];

// Routes
router.get('/', produitController.getAllProduits);
router.get('/:id', param('id').isInt().withMessage('ID doit être un entier'), produitController.getProduitById);
router.post('/', produitValidationRules, produitController.createProduit);
router.put('/:id', [param('id').isInt().withMessage('ID doit être un entier'), ...produitUpdateValidationRules], produitController.updateProduit);
router.delete('/:id', param('id').isInt().withMessage('ID doit être un entier'), produitController.deleteProduit);

module.exports = router; 