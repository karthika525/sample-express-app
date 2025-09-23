const express = require('express');
const router = express.Router();
const Device = require('../models/deviceModel');

/**
 * Create a new device
 * POST /api/devices
 * Body: { name, brand, price, warrantyMonths }
 */
router.post('/devices', async (req, res) => {
  try {
    const { name, brand, price, warrantyMonths } = req.body;
    const device = new Device({ name, brand, price, warrantyMonths });

    // synchronous validation (returns ValidationError if invalid)
    const validationError = device.validateSync();
    if (validationError) {
      // build friendly errors object
      const errors = {};
      for (const key in validationError.errors) {
        errors[key] = validationError.errors[key].message;
      }
      return res.status(400).json({ errors });
    }

    const saved = await device.save();
    return res.status(201).json({
      message: 'Device created successfully',
      data: {
        id: saved._id,
        name: saved.name,
        brand: saved.brand,
        price: saved.price,
        warrantyMonths: saved.warrantyMonths
      }
    });
  } catch (err) {
    console.error('Create device error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get all devices
 * GET /api/devices
 */
router.get('/devices', async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    const data = devices.map(d => ({
      id: d._id,
      name: d.name,
      brand: d.brand,
      price: d.price,
      warrantyMonths: d.warrantyMonths
    }));
    return res.status(200).json({ data });
  } catch (err) {
    console.error('Retrieve devices error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * Update a device
 * PUT /api/devices/:id
 * Body: { name, brand, price, warrantyMonths }
 */
router.put('/devices/:id', async (req, res) => {
  try {
    const deviceId = req.params.id;
    const { name, brand, price, warrantyMonths } = req.body;

    // validate by creating a temporary model instance
    const temp = new Device({ name, brand, price, warrantyMonths });
    const validationError = temp.validateSync();
    if (validationError) {
      const errors = {};
      for (const key in validationError.errors) {
        errors[key] = validationError.errors[key].message;
      }
      return res.status(400).json({ errors });
    }

    const updated = await Device.findByIdAndUpdate(
      deviceId,
      { name, brand, price, warrantyMonths },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Device not found' });
    }

    return res.status(200).json({
      message: 'Device updated successfully',
      data: {
        id: updated._id,
        name: updated.name,
        brand: updated.brand,
        price: updated.price,
        warrantyMonths: updated.warrantyMonths
      }
    });
  } catch (err) {
    console.error('Update device error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * Delete a device
 * DELETE /api/devices/:id
 */
router.delete('/devices/:id', async (req, res) => {
  try {
    const deviceId = req.params.id;
    const deleted = await Device.findByIdAndDelete(deviceId);
    if (!deleted) {
      return res.status(404).json({ message: 'Device not found' });
    }
    return res.status(200).json({ message: 'Device deleted successfully' });
  } catch (err) {
    console.error('Delete device error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
