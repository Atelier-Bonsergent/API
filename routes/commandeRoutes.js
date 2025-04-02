const express = require('express');
const { body, param } = require('express-validator');
const commandeController = require('../controllers/commandeController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const commandeValidationRules = [
  body('date_commande')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Format de date invalide (YYYY-MM-DD)')
    .custom(value => {
      const date = new Date(value);
      return !isNaN(date);
    }).withMessage('Date de commande invalide'),
  body('statut')
    .isIn(['en_attente', 'confirmée', 'expédiée', 'livrée']).withMessage('Statut invalide')
    .escape().withMessage('Statut contient des caractères non autorisés'),
  body('montant_total')
    .isDecimal().withMessage('Montant total doit être un nombre décimal')
    .notEmpty().withMessage('Montant total est requis')
];

// Routes
router.get('/', auth, commandeController.getAllCommandes);
router.get('/:id', auth, param('id').isInt().withMessage('ID doit être un entier'), commandeController.getCommandeById);
router.post('/', auth, commandeValidationRules, commandeController.createCommande);
router.put('/:id', auth, [param('id').isInt().withMessage('ID doit être un entier'), ...commandeValidationRules], commandeController.updateCommande);
router.delete('/:id', auth, param('id').isInt().withMessage('ID doit être un entier'), commandeController.deleteCommande);

module.exports = router;