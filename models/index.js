const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');
const Utilisateur = require('./Utilisateur');
const Projet = require('./Projet');
const Media = require('./Media');
const Produit = require('./Produit');
const Fournisseurs = require('./Fournisseurs');
const Devis = require('./Devis');
const DevisProduits = require('./DevisProduits');

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

Projet.hasMany(Devis, {
  foreignKey: 'id_projet',
  as: 'devis'
});

Devis.belongsTo(Projet, {
  foreignKey: 'id_projet'
});

Fournisseurs.hasMany(Produit, {
  foreignKey: 'id_fournisseurs',
  as: 'produits'
});

Produit.belongsTo(Fournisseurs, {
  foreignKey: 'id_fournisseurs'
});

// Many-to-many relationship between Devis and Produit
Devis.belongsToMany(Produit, {
  through: DevisProduits,
  foreignKey: 'id_devis',
  otherKey: 'id_produit',
  as: 'produits'
});

Produit.belongsToMany(Devis, {
  through: DevisProduits,
  foreignKey: 'id_produit',
  otherKey: 'id_devis',
  as: 'devis'
});

// Relations directes pour DevisProduits
DevisProduits.belongsTo(Devis, {
  foreignKey: 'id_devis'
});

DevisProduits.belongsTo(Produit, {
  foreignKey: 'id_produit'
});

Devis.hasMany(DevisProduits, {
  foreignKey: 'id_devis'
});

Produit.hasMany(DevisProduits, {
  foreignKey: 'id_produit'
});

module.exports = {
  sequelize,
  Utilisateur,
  Projet,
  Media,
  Produit,
  Fournisseurs,
  Devis,
  DevisProduits
};