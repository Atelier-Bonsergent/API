const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();

    // Clear all mocks
    jest.clearAllMocks();
  });

  test('should set req.user and call next() when token is valid', () => {
    // Mock the decoded token
    const decodedToken = { id: 1, email: 'test@example.com', role: 'user' };
    jwt.verify.mockReturnValue(decodedToken);
    
    // Mock the request header returning a token
    req.header.mockReturnValue('Bearer valid_token');
    
    // Call the middleware
    auth(req, res, next);
    
    // Assertions
    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(jwt.verify).toHaveBeenCalledWith('valid_token', process.env.JWT_SECRET);
    expect(req.user).toEqual(decodedToken);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should return 401 when Authorization header is missing', () => {
    // Mock the request header throwing an error
    req.header.mockImplementation(() => {
      throw new Error('Header not found');
    });
    
    // Call the middleware
    auth(req, res, next);
    
    // Assertions
    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Authentification requise" });
  });

  test('should return 401 when token is invalid', () => {
    // Mock the request header returning a token
    req.header.mockReturnValue('Bearer invalid_token');
    
    // Mock jwt.verify throwing an error
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    // Call the middleware
    auth(req, res, next);
    
    // Assertions
    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(jwt.verify).toHaveBeenCalledWith('invalid_token', process.env.JWT_SECRET);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Authentification requise" });
  });
}); 