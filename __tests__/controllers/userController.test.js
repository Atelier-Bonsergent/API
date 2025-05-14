const userController = require('../../controllers/userController');
const { Utilisateur } = require('../../models');
const bcrypt = require('bcryptjs');

// Mock the models and bcrypt
jest.mock('../../models', () => ({
  Utilisateur: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn()
}));

describe('User Controller', () => {
  let req;
  let res;
  
  beforeEach(() => {
    req = {
      body: {},
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    test('should return 401 if user not found', async () => {
      req.body = { email: 'test@example.com', mot_de_passe: 'password123' };
      Utilisateur.findOne.mockResolvedValue(null);

      await userController.loginUser(req, res);

      expect(Utilisateur.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email ou mot de passe incorrect' });
    });

    test('should return 401 if password is incorrect', async () => {
      req.body = { email: 'test@example.com', mot_de_passe: 'wrongpassword' };
      const mockUser = {
        email: 'test@example.com',
        mot_de_passe: 'hashedPassword',
        generateToken: jest.fn().mockReturnValue('token123')
      };
      
      Utilisateur.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await userController.loginUser(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email ou mot de passe incorrect' });
    });

    test('should return token if login is successful', async () => {
      req.body = { email: 'test@example.com', mot_de_passe: 'password123' };
      const mockUser = {
        email: 'test@example.com',
        mot_de_passe: 'hashedPassword',
        generateToken: jest.fn().mockReturnValue('token123')
      };
      
      Utilisateur.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await userController.loginUser(req, res);

      expect(mockUser.generateToken).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ token: 'token123' });
    });
  });

  describe('getAllUsers', () => {
    test('should return all users', async () => {
      const mockUsers = [
        { id: 1, nom: 'User1', email: 'user1@example.com' },
        { id: 2, nom: 'User2', email: 'user2@example.com' }
      ];
      
      Utilisateur.findAll.mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res);

      expect(Utilisateur.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    test('should handle errors', async () => {
      const error = new Error('Database error');
      Utilisateur.findAll.mockRejectedValue(error);

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('registerUser', () => {
    test('should create a new user and return token', async () => {
      req.body = {
        nom: 'Test',
        prenom: 'User',
        email: 'testuser@example.com',
        mot_de_passe: 'password123',
        telephone: '1234567890',
        role: 'user'
      };
      
      const mockUser = {
        id_utilisateur: 1,
        ...req.body,
        generateToken: jest.fn().mockReturnValue('token123')
      };
      
      Utilisateur.create.mockResolvedValue(mockUser);

      await userController.registerUser(req, res);

      expect(Utilisateur.create).toHaveBeenCalledWith(req.body);
      expect(mockUser.generateToken).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur créé avec succès",
        utilisateur: {
          id: mockUser.id_utilisateur,
          email: mockUser.email
        },
        token: 'token123'
      });
    });
  });
}); 