const express = require('express');
const { body, param } = require('express-validator');
const produitController = require('../controllers/produitController');

const router = express.Router();

// Validation rules
const produitValidationRules = [
    body('name').isString().withMessage('Name must be a string'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

// Routes
router.get('/', produitController.getAllProduits);
router.get('/:id', param('id').isInt().withMessage('ID must be an integer'), produitController.getProduitById);
router.post('/', produitValidationRules, produitController.createProduit);
router.put('/:id', [param('id').isInt().withMessage('ID must be an integer'), ...produitValidationRules], produitController.updateProduit);
router.delete('/:id', param('id').isInt().withMessage('ID must be an integer'), produitController.deleteProduit);

module.exports = router; 