const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

router.post('/login', 
  loginLimiter, 
  [
    check('email').isEmail().withMessage('Email invalide'),
    check('mot_de_passe').notEmpty().withMessage('Le mot de passe est requis')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  userController.loginUser
);

router.post('/register', 
  registerLimiter, 
  [
    check('nom').notEmpty().withMessage('Le nom est requis'),
    check('prenom').notEmpty().withMessage('Le prénom est requis'),
    check('email').isEmail().withMessage('Email invalide'),
    check('mot_de_passe').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    check('telephone').notEmpty().withMessage('Le numéro de téléphone est requis'),
    check('role').notEmpty().withMessage('Le rôle est requis')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  userController.registerUser
);

router.get('/profile', auth, userController.getProfile);
router.get('/', auth, userController.getAllUsers);

router.put('/profile', 
  auth,
  [
    check('email').optional().isEmail().withMessage('Email invalide'),
    check('nom').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
    check('prenom').optional().notEmpty().withMessage('Le prénom ne peut pas être vide'),
    check('telephone').optional().notEmpty().withMessage('Le numéro de téléphone ne peut pas être vide'),
    check('mot_de_passe').optional().isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    check('ancien_mot_de_passe').optional().notEmpty().withMessage('L\'ancien mot de passe est requis pour changer le mot de passe')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  userController.updateUser
);

module.exports = router;
