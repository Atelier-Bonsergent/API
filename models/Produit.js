const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Produit extends Model {}

Produit.init({
  id_produit: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  categorie: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prix: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  unite_mesure: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  id_fournisseurs: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'fournisseurs',
      key: 'id_fournisseurs'
    }
  }
}, {
  sequelize,
  modelName: 'Produit',
  tableName: 'produits',
  timestamps: false
});

module.exports = Produit;