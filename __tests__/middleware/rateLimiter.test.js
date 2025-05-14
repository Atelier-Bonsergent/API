// Mock express-rate-limit
jest.mock('express-rate-limit', () => {
  return jest.fn().mockImplementation((config) => {
    return { config };
  });
});

describe('Rate Limiter Middleware', () => {
  // Save original env values
  const originalEnv = { ...process.env };
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Reset env variables
    process.env = { ...originalEnv };
  });
  
  afterAll(() => {
    // Restore original env values after all tests
    process.env = originalEnv;
  });

  describe('loginLimiter', () => {
    test('should use default values when environment variables are not set', () => {
      // Clear the relevant env variables
      delete process.env.LOGIN_WINDOW_MS;
      delete process.env.LOGIN_MAX_REQUESTS;
      
      // Require the module to use default values
      jest.isolateModules(() => {
        const rateLimit = require('express-rate-limit');
        const { loginLimiter } = require('../../middleware/rateLimiter');
        
        // Access the config directly from the mock implementation result
        expect(loginLimiter.config).toEqual(expect.objectContaining({
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 5,
          message: "Trop de tentatives de connexion, veuillez réessayer après 15 minutes."
        }));
      });
    });

    test('should use environment variables when set', () => {
      // Set env variables
      process.env.LOGIN_WINDOW_MS = '600000';  // 10 minutes
      process.env.LOGIN_MAX_REQUESTS = '10';
      
      // Require the module to use new values
      jest.isolateModules(() => {
        const rateLimit = require('express-rate-limit');
        const { loginLimiter } = require('../../middleware/rateLimiter');
        
        expect(loginLimiter.config).toEqual(expect.objectContaining({
          windowMs: 600000, // 10 minutes from env var
          max: 10,
          message: "Trop de tentatives de connexion, veuillez réessayer après 15 minutes."
        }));
      });
    });
  });

  describe('registerLimiter', () => {
    test('should use default values when environment variables are not set', () => {
      // Clear the relevant env variables
      delete process.env.REGISTER_WINDOW_MS;
      delete process.env.REGISTER_MAX_REQUESTS;
      
      // Require the module to use default values
      jest.isolateModules(() => {
        const rateLimit = require('express-rate-limit');
        const { registerLimiter } = require('../../middleware/rateLimiter');
        
        expect(registerLimiter.config).toEqual(expect.objectContaining({
          windowMs: 60 * 60 * 1000, // 1 hour
          max: 3,
          message: "Trop de tentatives d'inscription, veuillez réessayer après une heure."
        }));
      });
    });

    test('should use environment variables when set', () => {
      // Set env variables
      process.env.REGISTER_WINDOW_MS = '1800000';  // 30 minutes
      process.env.REGISTER_MAX_REQUESTS = '5';
      
      // Require the module to use new values
      jest.isolateModules(() => {
        const rateLimit = require('express-rate-limit');
        const { registerLimiter } = require('../../middleware/rateLimiter');
        
        expect(registerLimiter.config).toEqual(expect.objectContaining({
          windowMs: 1800000, // 30 minutes
          max: 5,
          message: "Trop de tentatives d'inscription, veuillez réessayer après une heure."
        }));
      });
    });
  });
}); 