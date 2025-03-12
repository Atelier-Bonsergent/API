const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class CatalogueFournisseurs extends Model {}

CatalogueFournisseurs.init({
  id_fournisseurs: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom_fournisseur: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  categorie: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'CatalogueFournisseurs',
  tableName: 'cataloguefournisseurs',
  timestamps: false
});

module.exports = CatalogueFournisseurs; 