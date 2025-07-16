const userModel = require('../models/userModel');
const express = require('express');
const router = express.Router();


router.get('/users', async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users.map(u => u.email));
  } catch (error) {
    res.status(500).json({ message: 'khong lay duoc danh sach user' });
  }
});

module.exports = router;