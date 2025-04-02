const express = require('express');
const { body, param } = require('express-validator');
const projetController = require('../controllers/projetController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules for creating a project
const projetValidationRules = [
    body('titre')
        .isString().withMessage('Titre doit être une chaîne de caractères')
        .escape().withMessage('Titre contient des caractères non autorisés'),
    body('description')
        .isString().withMessage('Description doit être une chaîne de caractères')
        .escape().withMessage('Description contient des caractères non autorisés'),
    body('type_projet')
        .isString().withMessage('Type de projet doit être une chaîne de caractères')
        .escape().withMessage('Type de projet contient des caractères non autorisés'),
    body('statut')
        .isString().withMessage('Statut doit être une chaîne de caractères')
        .escape().withMessage('Statut contient des caractères non autorisés'),
    body('id_utilisateur')
        .isInt().withMessage('ID utilisateur doit être un entier')
];

// Validation rules for updating a project
const projetUpdateValidationRules = [
    body('titre')
        .optional()
        .isString().withMessage('Titre doit être une chaîne de caractères')
        .escape().withMessage('Titre contient des caractères non autorisés'),
    body('description')
        .optional()
        .isString().withMessage('Description doit être une chaîne de caractères')
        .escape().withMessage('Description contient des caractères non autorisés'),
    body('type_projet')
        .optional()
        .isString().withMessage('Type de projet doit être une chaîne de caractères')
        .escape().withMessage('Type de projet contient des caractères non autorisés'),
    body('statut')
        .optional()
        .isString().withMessage('Statut doit être une chaîne de caractères')
        .escape().withMessage('Statut contient des caractères non autorisés'),
    body('id_utilisateur')
        .optional()
        .isInt().withMessage('ID utilisateur doit être un entier')
];

// Routes
router.get('/', auth, projetController.getAllProjets);
router.get('/:id', auth, param('id').isInt().withMessage('ID doit être un entier'), projetController.getProjetById);
router.post('/', auth, projetValidationRules, projetController.createProjet);
router.put('/:id', auth, [param('id').isInt().withMessage('ID doit être un entier'), ...projetUpdateValidationRules], projetController.updateProjet);
router.delete('/:id', auth, param('id').isInt().withMessage('ID doit être un entier'), projetController.deleteProjet);

module.exports = router;