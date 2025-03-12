const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Projet extends Model {}

Projet.init({
  id_projet: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titre: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type_projet: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  statut: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_maj: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'utilisateur',
      key: 'id_utilisateur'
    }
  }
}, {
  sequelize,
  modelName: 'Projet',
  tableName: 'projet',
  timestamps: false
});

module.exports = Projet; 