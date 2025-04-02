const { validationResult } = require('express-validator');
const { Media } = require('../models');

const mediaController = {
  getAll: async (req, res) => {
    try {
      const medias = await Media.findAll();
      res.json({ status: 'success', message: 'Medias retrieved', data: medias });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  getById: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const media = await Media.findByPk(req.params.id);
      if (!media) {
        return res.status(404).json({ status: 'fail', message: 'Media not found' });
      }
      res.json({ status: 'success', message: 'Media retrieved', data: media });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  create: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const media = await Media.create(req.body);
      res.status(201).json({ status: 'success', message: 'Media created', data: media });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  update: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const media = await Media.findByPk(req.params.id);
      if (!media) {
        return res.status(404).json({ status: 'fail', message: 'Media not found' });
      }
      await media.update(req.body);
      res.json({ status: 'success', message: 'Media updated', data: media });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  },

  delete: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
    }

    try {
      const media = await Media.findByPk(req.params.id);
      if (!media) {
        return res.status(404).json({ status: 'fail', message: 'Media not found' });
      }
      await media.destroy();
      res.json({ status: 'success', message: 'Media deleted' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  }
};

module.exports = mediaController;