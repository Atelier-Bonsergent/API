const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const utilisateurRoutes = require('./routes/utilisateurRoutes');
const projetRoutes = require('./routes/projetRoutes');
const produitRoutes = require('./routes/produitRoutes');
const fournisseursRoutes = require('./routes/fournisseursRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const devisRoutes = require('./routes/devisRoutes');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurer Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Routes
app.use('/utilisateurs', utilisateurRoutes);
app.use('/projets', projetRoutes);
app.use('/produits', produitRoutes);
app.use('/fournisseurs', fournisseursRoutes);  
app.use('/medias', mediaRoutes);
app.use('/devis', devisRoutes);

// Database synchronization and server start
const PORT = process.env.PORT || 3000;

sequelize.sync()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
      console.log(`Accès local: http://localhost:${PORT}`);
      console.log(`Accès réseau: http://10.101.10.143:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erreur de synchronisation de la base de données:', err);
  });
