const express = require('express');
const { getContestLeaderboard } = require('../controllers/leaderboard.controller');

const router = express.Router();

router.get('/:contestId', getContestLeaderboard);

module.exports = router;


