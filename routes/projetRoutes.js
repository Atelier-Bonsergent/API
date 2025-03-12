const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projetController');
const auth = require('../middleware/auth');

// Routes pour les projets
router.get('/', auth, projetController.getAllProjets);
router.get('/:id', auth, projetController.getProjetById);
router.post('/', auth, projetController.createProjet);
router.put('/:id', auth, projetController.updateProjet);
router.delete('/:id', auth, projetController.deleteProjet);

module.exports = router;