const request = require('supertest');
const express = require('express');
const userController = require('../../controllers/userController');
const auth = require('../../middleware/auth');
const { loginLimiter, registerLimiter } = require('../../middleware/rateLimiter');

// Mock middleware and controllers
jest.mock('../../controllers/userController');
jest.mock('../../middleware/auth', () => jest.fn((req, res, next) => next()));
jest.mock('../../middleware/rateLimiter', () => ({
  loginLimiter: jest.fn((req, res, next) => next()),
  registerLimiter: jest.fn((req, res, next) => next())
}));

// Create express app for testing
const app = express();
app.use(express.json());

// Import routes
const utilisateurRoutes = require('../../routes/utilisateurRoutes');
app.use('/utilisateurs', utilisateurRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /utilisateurs/login', () => {
    test('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/utilisateurs/login')
        .send({ email: 'invalidemail', mot_de_passe: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(userController.loginUser).not.toHaveBeenCalled();
    });

    test('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/utilisateurs/login')
        .send({ email: 'valid@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(userController.loginUser).not.toHaveBeenCalled();
    });

    test('should call loginUser controller with valid data', async () => {
      userController.loginUser.mockImplementation((req, res) => {
        res.json({ token: 'mock-token' });
      });

      const response = await request(app)
        .post('/utilisateurs/login')
        .send({ email: 'valid@example.com', mot_de_passe: 'password123' });

      expect(loginLimiter).toHaveBeenCalled();
      expect(userController.loginUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'mock-token');
    });
  });

  describe('POST /utilisateurs/register', () => {
    test('should handle existing user with correct password', async () => {
      userController.registerUser.mockImplementation((req, res) => {
        res.json({ 
          message: 'Connexion réussie avec un compte existant',
          utilisateur: { id: 1, email: req.body.email },
          token: 'mock-token'
        });
      });

      const existingUser = {
        nom: 'Test',
        prenom: 'User',
        email: 'existing@example.com',
        mot_de_passe: 'correctPassword',
        telephone: '1234567890',
        role: 'user'
      };

      const response = await request(app)
        .post('/utilisateurs/register')
        .send(existingUser);

      expect(registerLimiter).toHaveBeenCalled();
      expect(userController.registerUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Connexion réussie avec un compte existant');
      expect(response.body).toHaveProperty('token');
    });

    test('should return 400 for existing user with wrong password', async () => {
      userController.registerUser.mockImplementation((req, res) => {
        res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
      });

      const existingUser = {
        nom: 'Test',
        prenom: 'User',
        email: 'existing@example.com',
        mot_de_passe: 'wrongPassword',
        telephone: '1234567890',
        role: 'user'
      };

      const response = await request(app)
        .post('/utilisateurs/register')
        .send(existingUser);

      expect(registerLimiter).toHaveBeenCalled();
      expect(userController.registerUser).toHaveBeenCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Un utilisateur avec cet email existe déjà');
    });

    test('should create new user if email does not exist', async () => {
      userController.registerUser.mockImplementation((req, res) => {
        res.status(201).json({ 
          message: 'Utilisateur créé avec succès',
          utilisateur: { id: 1, email: req.body.email },
          token: 'mock-token'
        });
      });

      const newUser = {
        nom: 'New',
        prenom: 'User',
        email: 'new@example.com',
        mot_de_passe: 'password123',
        telephone: '1234567890',
        role: 'user'
      };

      const response = await request(app)
        .post('/utilisateurs/register')
        .send(newUser);

      expect(registerLimiter).toHaveBeenCalled();
      expect(userController.registerUser).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Utilisateur créé avec succès');
      expect(response.body.utilisateur).toHaveProperty('email', newUser.email);
    });
  });

  describe('GET /utilisateurs/profile', () => {
    test('should use auth middleware and call getProfile controller', async () => {
      userController.getProfile.mockImplementation((req, res) => {
        res.json({ id: 1, email: 'user@example.com' });
      });

      const response = await request(app)
        .get('/utilisateurs/profile');

      expect(auth).toHaveBeenCalled();
      expect(userController.getProfile).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('GET /utilisateurs', () => {
    test('should use auth middleware and call getAllUsers controller', async () => {
      userController.getAllUsers.mockImplementation((req, res) => {
        res.json([{ id: 1, email: 'user1@example.com' }, { id: 2, email: 'user2@example.com' }]);
      });

      const response = await request(app)
        .get('/utilisateurs');

      expect(auth).toHaveBeenCalled();
      expect(userController.getAllUsers).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});