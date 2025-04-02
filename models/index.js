const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');
const Utilisateur = require('./Utilisateur');
const Projet = require('./Projet');
const Media = require('./Media');
const Produit = require('./Produit');
const Fournisseurs = require('./Fournisseurs');
const Devis = require('./Devis');
const Commande = require('./Commande'); 

// Définir les relations
Utilisateur.hasMany(Projet, {
  foreignKey: 'id_utilisateur',
  as: 'projets'
});

Projet.belongsTo(Utilisateur, {
  foreignKey: 'id_utilisateur'
});

Projet.hasMany(Media, {
  foreignKey: 'id_projet',
  as: 'medias'
});

Media.belongsTo(Projet, {
  foreignKey: 'id_projet'
});

// Nouvelles relations
Projet.hasMany(Devis, {
  foreignKey: 'id_projet',
  as: 'devis'
});

Devis.belongsTo(Projet, {
  foreignKey: 'id_projet'
});

Fournisseurs.hasMany(Produit, {
  foreignKey: 'id_fournisseurs',
  as: 'produit'
});

Produit.belongsTo(Fournisseurs, {
  foreignKey: 'id_fournisseurs'
});

// Relation many-to-many entre Devis et Produit
const DetailDevis = sequelize.define('DetailDevis', {}, {
  tableName: 'detaildevis',
  timestamps: false
});

Devis.belongsToMany(Produit, { 
  through: DetailDevis,
  foreignKey: 'id_devis',
  otherKey: 'id_produit',
  as: 'produit'
});

Produit.belongsToMany(Devis, { 
  through: DetailDevis,
  foreignKey: 'id_produit',
  otherKey: 'id_devis',
  as: 'devis'
});

module.exports = {
  sequelize,
  Utilisateur,
  Projet,
  Media,
  Produit,
  Fournisseurs,
  Devis,
  DetailDevis,
  Commande  // Décommenter cette ligne
};