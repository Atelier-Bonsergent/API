const express = require('express');
const { body, param } = require('express-validator');
const produitController = require('../controllers/produitController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules for creating a product
const produitValidationRules = [
    body('nom')
        .isString().withMessage('Nom doit être une chaîne de caractères')
        .escape().withMessage('Nom contient des caractères non autorisés'),
    body('categorie')
        .isString().withMessage('Catégorie doit être une chaîne de caractères')
        .escape().withMessage('Catégorie contient des caractères non autorisés'),
    body('description')
        .isString().withMessage('Description doit être une chaîne de caractères')
        .escape().withMessage('Description contient des caractères non autorisés'),
    body('prix')
        .isDecimal({ decimal_digits: '0,2' }).withMessage('Prix doit être un nombre décimal positif'),
    body('quantite')
        .isInt({ min: 0 }).withMessage('Quantité doit être un entier non négatif'),
    body('unite_mesure')
        .isString().withMessage('Unité de mesure doit être une chaîne de caractères')
        .escape().withMessage('Unité de mesure contient des caractères non autorisés')
];

// Validation rules for updating a product
const produitUpdateValidationRules = [
    body('nom')
        .optional()
        .isString().withMessage('Nom doit être une chaîne de caractères')
        .escape().withMessage('Nom contient des caractères non autorisés'),
    body('categorie')
        .optional()
        .isString().withMessage('Catégorie doit être une chaîne de caractères')
        .escape().withMessage('Catégorie contient des caractères non autorisés'),
    body('description')
        .optional()
        .isString().withMessage('Description doit être une chaîne de caractères')
        .escape().withMessage('Description contient des caractères non autorisés'),
    body('prix')
        .optional()
        .isDecimal({ decimal_digits: '0,2' }).withMessage('Prix doit être un nombre décimal positif'),
    body('unite_mesure')
        .optional()
        .isString().withMessage('Unité de mesure doit être une chaîne de caractères')
        .escape().withMessage('Unité de mesure contient des caractères non autorisés')
];

// Routes
router.get('/',auth, produitController.getAllProduits);
router.get('/:id',auth, param('id').isInt().withMessage('ID doit être un entier'), produitController.getProduitById);
router.post('/',auth, produitValidationRules, produitController.createProduit);
router.put('/:id',auth, [param('id').isInt().withMessage('ID doit être un entier'), ...produitUpdateValidationRules], produitController.updateProduit);
router.delete('/:id',auth, param('id').isInt().withMessage('ID doit être un entier'), produitController.deleteProduit);

module.exports = router;