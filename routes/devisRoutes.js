const express = require('express');
const { body, param } = require('express-validator');
const devisController = require('../controllers/devisController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const devisValidationRules = [
  body('montant_estime')
    .isDecimal().withMessage('Montant estimé doit être un nombre décimal')
    .notEmpty().withMessage('Montant estimé est requis'),
  body('statut')
    .isString().withMessage('Statut doit être une chaîne de caractères')
    .escape().withMessage('Statut contient des caractères non autorisés')
    .notEmpty().withMessage('Statut est requis'),
  body('id_projet')
    .isInt().withMessage('ID projet doit être un entier')
    .notEmpty().withMessage('ID projet est requis')
];

// Routes
router.get('/', auth, devisController.getAllDevis);
router.get('/:id', auth, param('id').isInt().withMessage('ID doit être un entier'), devisController.getDevisById);
router.post('/', auth, devisValidationRules, devisController.createDevis);
router.put('/:id', auth, [param('id').isInt().withMessage('ID doit être un entier'), ...devisValidationRules], devisController.updateDevis);
router.delete('/:id', auth, param('id').isInt().withMessage('ID doit être un entier'), devisController.deleteDevis);

module.exports = router;