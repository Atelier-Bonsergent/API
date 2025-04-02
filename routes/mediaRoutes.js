const express = require('express');
const { body, param } = require('express-validator');
const mediaController = require('../controllers/mediaController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const validationRules = [
  body('url')
    .isString().withMessage('URL doit être une chaîne de caractères')
    .notEmpty().withMessage('URL est requis')
    .escape().withMessage('URL contient des caractères non autorisés'),
  body('id_projet')
    .isInt().withMessage('ID projet doit être un entier')
    .notEmpty().withMessage('ID projet est requis')
];

// Routes
router.get('/', auth, mediaController.getAll);
router.get('/:id', auth, param('id').isInt().withMessage('ID doit être un entier'), mediaController.getById);
router.post('/', auth, validationRules, mediaController.create);
router.put('/:id', auth, [param('id').isInt().withMessage('ID doit être un entier'), ...validationRules], mediaController.update);
router.delete('/:id', auth, param('id').isInt().withMessage('ID doit être un entier'), mediaController.delete);

module.exports = router;