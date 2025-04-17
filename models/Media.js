const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Media extends Model {}

Media.init({
  id_media: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date_ajout: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  id_projet: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Projet',  // Updated from 'projet' to 'Projet'
      key: 'id_projet'
    }
  }
}, {
  sequelize,
  modelName: 'Media',
  tableName: 'medias',
  timestamps: false
});

module.exports = Media;