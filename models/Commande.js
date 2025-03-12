const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Commande extends Model {}

Commande.init({
  id_commande: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date_commande: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'confirmée', 'expédiée', 'livrée'),
    allowNull: false,
    defaultValue: 'en_attente'
  },
  montant_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Commande'
});

module.exports = Commande; 