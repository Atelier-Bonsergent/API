const produitController = require('../../controllers/produitController');
const { Produit } = require('../../models');
const { validationResult } = require('express-validator');

// Mock the dependencies
jest.mock('../../models', () => ({
  Produit: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('express-validator', () => ({
  validationResult: jest.fn()
}));

describe('Produit Controller', () => {
  let req;
  let res;
  
  beforeEach(() => {
    req = {
      body: {},
      params: { id: '1' }
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Default validationResult implementation (no errors)
    validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([])
    });
  });

  describe('getAllProduits', () => {
    test('should return all products', async () => {
      const mockProduits = [
        { id: 1, nom: 'Product 1', prix: 100 },
        { id: 2, nom: 'Product 2', prix: 200 }
      ];
      
      Produit.findAll.mockResolvedValue(mockProduits);
      
      await produitController.getAllProduits(req, res);
      
      expect(Produit.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Produits retrieved',
        data: mockProduits
      });
    });
    
    test('should handle errors', async () => {
      const error = new Error('Database error');
      Produit.findAll.mockRejectedValue(error);
      
      await produitController.getAllProduits(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Server error',
        error: error.message
      });
    });
  });
  
  describe('getProduitById', () => {
    test('should return validation errors if present', async () => {
      // Mock validation errors
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: 'ID is required' }])
      });
      
      await produitController.getProduitById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Validation error',
        errors: [{ msg: 'ID is required' }]
      });
      expect(Produit.findByPk).not.toHaveBeenCalled();
    });
    
    test('should return 404 if product not found', async () => {
      Produit.findByPk.mockResolvedValue(null);
      
      await produitController.getProduitById(req, res);
      
      expect(Produit.findByPk).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Produit not found'
      });
    });
    
    test('should return product if found', async () => {
      const mockProduit = { id: 1, nom: 'Product 1', prix: 100 };
      Produit.findByPk.mockResolvedValue(mockProduit);
      
      await produitController.getProduitById(req, res);
      
      expect(Produit.findByPk).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Produit retrieved',
        data: mockProduit
      });
    });
    
    test('should handle errors', async () => {
      const error = new Error('Database error');
      Produit.findByPk.mockRejectedValue(error);
      
      await produitController.getProduitById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Server error',
        error: error.message
      });
    });
  });
  
  describe('createProduit', () => {
    test('should return validation errors if present', async () => {
      // Mock validation errors
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: 'Name is required' }])
      });
      
      await produitController.createProduit(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Validation error',
        errors: [{ msg: 'Name is required' }]
      });
      expect(Produit.create).not.toHaveBeenCalled();
    });
    
    test('should create product if data is valid', async () => {
      const productData = { nom: 'New Product', prix: 150 };
      req.body = productData;
      
      const createdProduct = { id: 3, ...productData };
      Produit.create.mockResolvedValue(createdProduct);
      
      await produitController.createProduit(req, res);
      
      expect(Produit.create).toHaveBeenCalledWith(productData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Produit created',
        data: createdProduct
      });
    });
    
    test('should handle errors', async () => {
      const error = new Error('Database error');
      Produit.create.mockRejectedValue(error);
      
      await produitController.createProduit(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Server error',
        error: error.message
      });
    });
  });
  
  describe('updateProduit', () => {
    test('should return validation errors if present', async () => {
      // Mock validation errors
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: 'Invalid data' }])
      });
      
      await produitController.updateProduit(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Validation error',
        errors: [{ msg: 'Invalid data' }]
      });
      expect(Produit.findByPk).not.toHaveBeenCalled();
    });
    
    test('should return 404 if product not found', async () => {
      Produit.findByPk.mockResolvedValue(null);
      
      await produitController.updateProduit(req, res);
      
      expect(Produit.findByPk).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Produit not found'
      });
    });
    
    test('should update product if found', async () => {
      const updateData = { nom: 'Updated Product', prix: 180 };
      req.body = updateData;
      
      const mockProduit = { 
        id: 1, 
        nom: 'Original Product', 
        prix: 100,
        update: jest.fn().mockResolvedValue(true)
      };
      
      Produit.findByPk.mockResolvedValue(mockProduit);
      
      await produitController.updateProduit(req, res);
      
      expect(Produit.findByPk).toHaveBeenCalledWith('1');
      expect(mockProduit.update).toHaveBeenCalledWith(updateData);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Produit updated',
        data: mockProduit
      });
    });
    
    test('should handle errors', async () => {
      const error = new Error('Database error');
      Produit.findByPk.mockRejectedValue(error);
      
      await produitController.updateProduit(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Server error',
        error: error.message
      });
    });
  });
  
  describe('deleteProduit', () => {
    test('should return validation errors if present', async () => {
      // Mock validation errors
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: 'Invalid ID' }])
      });
      
      await produitController.deleteProduit(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Validation error',
        errors: [{ msg: 'Invalid ID' }]
      });
      expect(Produit.findByPk).not.toHaveBeenCalled();
    });
    
    test('should return 404 if product not found', async () => {
      Produit.findByPk.mockResolvedValue(null);
      
      await produitController.deleteProduit(req, res);
      
      expect(Produit.findByPk).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Produit not found'
      });
    });
    
    test('should delete product if found', async () => {
      const mockProduit = { 
        id: 1, 
        nom: 'Product to delete', 
        prix: 100,
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      Produit.findByPk.mockResolvedValue(mockProduit);
      
      await produitController.deleteProduit(req, res);
      
      expect(Produit.findByPk).toHaveBeenCalledWith('1');
      expect(mockProduit.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Produit deleted'
      });
    });
    
    test('should handle errors', async () => {
      const error = new Error('Database error');
      Produit.findByPk.mockRejectedValue(error);
      
      await produitController.deleteProduit(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Server error',
        error: error.message
      });
    });
  });
}); 