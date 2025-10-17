const express = require('express');

const userRoutes = require('./user.routes');
const contestRoutes = require('./contest.routes');
const leaderboardRoutes = require('./leaderboard.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/contests', contestRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/admin', adminRoutes);

module.exports = router;