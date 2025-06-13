const { Utilisateur } = require('../../models');
const userController = require('../../controllers/userController');
const bcrypt = require('bcryptjs');

// Mock the models and bcrypt
jest.mock('../../models', () => ({
  Utilisateur: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn()
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
      body: {
        nom: 'Test',
        prenom: 'User',
        email: 'testuser@example.com',
        mot_de_passe: 'password123',
        telephone: '1234567890',
        role: 'user'
      },
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
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
      // Mock user creation
      const mockUser = {
        id_utilisateur: 1,
        ...req.body,
        generateToken: jest.fn().mockReturnValue('mock-token')
      };
      
      // Mock findOne to return null (user doesn't exist)
      Utilisateur.findOne.mockResolvedValue(null);
      
      // Mock create to return our mockUser
      Utilisateur.create.mockResolvedValue(mockUser);

      await userController.registerUser(req, res);

      expect(Utilisateur.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email }
      });
      
      expect(Utilisateur.create).toHaveBeenCalledWith({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        mot_de_passe: req.body.mot_de_passe,
        telephone: req.body.telephone,
        role: req.body.role
      });

      expect(mockUser.generateToken).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur créé avec succès",
        utilisateur: {
          id: mockUser.id_utilisateur,
          email: mockUser.email
        },
        token: 'mock-token'
      });
    });

    test('should return error if user already exists', async () => {
      // Mock existing user
      Utilisateur.findOne.mockResolvedValue({
        id_utilisateur: 1,
        email: req.body.email
      });

      await userController.registerUser(req, res);

      expect(Utilisateur.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email }
      });
      expect(Utilisateur.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Un utilisateur avec cet email existe déjà"
      });
    });

    test('should handle server errors', async () => {
      // Mock database error
      Utilisateur.findOne.mockRejectedValue(new Error('Database error'));

      await userController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error'
      });
    });
  });
});