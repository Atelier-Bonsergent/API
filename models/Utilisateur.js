const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Utilisateur extends Model {
  async comparePassword(password) {
    console.log('Comparing passwords:');
    console.log('Input password:', password);
    console.log('Stored hash:', this.mot_de_passe);
    console.log('Hash starts with $2y$:', this.mot_de_passe.startsWith('$2y$'));
    
    try {
      const isValid = await bcrypt.compare(password, this.mot_de_passe);
      console.log('Password comparison result:', isValid);
      return isValid;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }

  generateToken() {
    return jwt.sign(
      { id: this.id_utilisateur, email: this.email, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}

Utilisateur.init({
  id_utilisateur: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  mot_de_passe: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Utilisateur',
  tableName: 'utilisateur',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.mot_de_passe) {
        user.mot_de_passe = await bcrypt.hash(user.mot_de_passe, 10);
      }
    }
  }
});

module.exports = Utilisateur;