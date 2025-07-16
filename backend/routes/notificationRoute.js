const express = require('express');
const router = express.Router();
const inviteModel = require('../models/inviteModel');
const { authToken } = require('../middlewares/auth');

// Lay danh sach duoc moi cua user
router.get('/', authToken, async (req, res) => {
  try {
    const email = req.userEmail;
    const invites = await inviteModel.getInvitationsForUser(email);
    res.status(200).json(invites);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy lời mời' });
  }
});

module.exports = router;