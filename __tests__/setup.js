// Set up environment variables for testing
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.NODE_ENV = 'test';

// Mock console.error to avoid cluttering test output
console.error = jest.fn();

// This file is automatically loaded by Jest before all tests
// It's referenced in the jest.config.js setupFilesAfterEnv option

// Add a dummy test so Jest doesn't complain about no tests
describe('Test Environment Setup', () => {
  test('environment variables are set correctly', () => {
    expect(process.env.JWT_SECRET).toBe('test_jwt_secret');
    expect(process.env.NODE_ENV).toBe('test');
  });
});

// Add a global teardown to clean up resources after tests
afterAll(() => {
  // Restore console.error
  console.error.mockRestore();
}); 