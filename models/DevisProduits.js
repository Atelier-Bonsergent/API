const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class DevisProduits extends Model {}

DevisProduits.init({
  id_devis: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'devis',  // Changé de 'Devis' à 'devis'
      key: 'id_devis'
    }
  },
  id_produit: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'produits',
      key: 'id_produit'
    }
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'DevisProduits',
  tableName: 'devis_produits',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['id_devis', 'id_produit']
    }
  ]
});

module.exports = DevisProduits;