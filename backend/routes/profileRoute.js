const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authToken } = require("../middlewares/auth");
const upload = require('../middlewares/upload');


router.get("/", authToken, profileController.getProfile);
router.put('/', authToken, profileController.updateProfile);
router.put('/update-avatar', authToken, upload.single("avatar"), profileController.updateAvatar);
router.get("/:email", authToken, profileController.getUserByEmail);

module.exports = router;