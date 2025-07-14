const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.post('/request-verification', authController.verifyEmail);
router.post('/google-signin', authController.googleSignIn);

module.exports = router;