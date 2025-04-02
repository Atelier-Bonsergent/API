const express = require('express');
const { body, param } = require('express-validator');
const fournisseursController = require('../controllers/fournisseursController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const validationRules = [
  body('nom_fournisseur')
    .isString().withMessage('Nom du fournisseur doit être une chaîne de caractères')
    .escape().withMessage('Nom du fournisseur contient des caractères non autorisés')
    .notEmpty().withMessage('Nom du fournisseur est requis')
];

// Routes
router.get('/', auth, fournisseursController.getAll);
router.get('/:id', auth, param('id').isInt().withMessage('ID doit être un entier'), fournisseursController.getById);
router.post('/', auth, validationRules, fournisseursController.create);
router.put('/:id', auth, [param('id').isInt().withMessage('ID doit être un entier'), ...validationRules], fournisseursController.update);
router.delete('/:id', auth, param('id').isInt().withMessage('ID doit être un entier'), fournisseursController.delete);

module.exports = router;