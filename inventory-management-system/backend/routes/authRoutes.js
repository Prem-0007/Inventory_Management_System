const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.get('/me', protect, getMe);

module.exports = router;
