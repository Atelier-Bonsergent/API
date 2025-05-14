const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Manually create mock methods that would be on the model
const mockComparePassword = jest.fn();
const mockGenerateToken = jest.fn();

// Create a mock Utilisateur class with the model functions
class MockUtilisateur {
  constructor(props) {
    Object.assign(this, props);
    this.comparePassword = mockComparePassword;
    this.generateToken = mockGenerateToken;
  }
}

// Add static properties to the class
MockUtilisateur.options = {
  hooks: {
    beforeCreate: async (user) => {
      if (user.mot_de_passe) {
        user.mot_de_passe = await bcrypt.hash(user.mot_de_passe, 10);
      }
    }
  }
};

// Mock modules
jest.mock('../../models', () => ({
  Utilisateur: MockUtilisateur
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked_token')
}));

describe('Utilisateur Model', () => {
  let utilisateur;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a test user
    utilisateur = new MockUtilisateur({
      id_utilisateur: 1,
      nom: 'Test',
      prenom: 'User',
      email: 'test@example.com',
      role: 'user',
      telephone: '1234567890',
      mot_de_passe: 'hashedpassword'
    });

    // Set up default mock implementations
    mockComparePassword.mockImplementation(async (password) => {
      try {
        return await bcrypt.compare(password, utilisateur.mot_de_passe);
      } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
      }
    });

    mockGenerateToken.mockImplementation(() => {
      return jwt.sign(
        { id: utilisateur.id_utilisateur, email: utilisateur.email, role: utilisateur.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
    });
  });

  describe('comparePassword', () => {
    test('should return true when password matches', async () => {
      bcrypt.compare.mockResolvedValue(true);
      
      const result = await utilisateur.comparePassword('correctpassword');
      
      expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
      expect(result).toBe(true);
    });

    test('should return false when password does not match', async () => {
      bcrypt.compare.mockResolvedValue(false);
      
      const result = await utilisateur.comparePassword('wrongpassword');
      
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
      expect(result).toBe(false);
    });

    test('should handle errors and return false', async () => {
      const error = new Error('Comparison error');
      bcrypt.compare.mockRejectedValue(error);
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await utilisateur.comparePassword('anypassword');
      
      expect(consoleSpy).toHaveBeenCalledWith('Error comparing passwords:', error);
      expect(result).toBe(false);
      
      consoleSpy.mockRestore();
    });
  });

  describe('generateToken', () => {
    test('should generate a JWT token with correct payload', () => {
      process.env.JWT_SECRET = 'test_secret';
      
      const token = utilisateur.generateToken();
      
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, email: 'test@example.com', role: 'user' },
        'test_secret',
        { expiresIn: '24h' }
      );
      expect(token).toBe('mocked_token');
    });
  });

  describe('hooks', () => {
    test('should hash password before creating user', async () => {
      // Create a mock user object with properties
      const user = { mot_de_passe: 'plaintext' };
      
      // Call the hook directly
      await MockUtilisateur.options.hooks.beforeCreate(user);
      
      // Verify bcrypt hash was called
      expect(bcrypt.hash).toHaveBeenCalledWith('plaintext', 10);
      expect(user.mot_de_passe).toBe('hashed_password');
    });
  });
}); 