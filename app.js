const express = require('express');
const cors = require('cors');
require('dotenv').config();

const utilisateurRoutes = require('./routes/utilisateurRoutes');
const projetRoutes = require('./routes/projetRoutes');
const produitRoutes = require('./routes/produitRoutes');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/utilisateurs', utilisateurRoutes);
app.use('/projets', projetRoutes);
app.use('/produits', produitRoutes);


// Database synchronization and server start
const PORT = process.env.PORT || 3000;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      
    });
  })
  .catch(err => {
    console.error('Erreur de synchronisation de la base de données:', err);
  });
