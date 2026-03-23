const express = require('express');
const router = express.Router();
const { getUserProgress, getRecommendations } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/progress', protect, getUserProgress);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;
