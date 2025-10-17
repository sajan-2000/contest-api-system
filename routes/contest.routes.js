const express = require('express');
const { listContests, getContest, submitAnswers } = require('../controllers/contest.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

const router = express.Router();

// Public list
router.get('/', isAuthenticated, listContests);

router.get('/:contestId', isAuthenticated, getContest);
router.post('/:contestId/submit', isAuthenticated, submitAnswers);

module.exports = router;


