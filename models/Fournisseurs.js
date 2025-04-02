const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Fournisseurs extends Model {}

Fournisseurs.init({
  id_fournisseurs: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom_fournisseur: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Fournisseurs',
  tableName: 'fournisseurs',
  timestamps: false
});

module.exports = Fournisseurs; 