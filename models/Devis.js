const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Devis extends Model {}

Devis.init({
  id_devis: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  montant_estime: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  montant_final: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  statut: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  id_projet: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projets',
      key: 'id_projet'
    }
  }
}, {
  sequelize,
  modelName: 'Devis',
  tableName: 'devis',
  timestamps: false
});

module.exports = Devis;