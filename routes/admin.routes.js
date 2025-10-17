const express = require('express');
const { createContest, addQuestionToContest } = require('../controllers/admin.controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(isAuthenticated);
router.use(isAdmin);


router.post('/contests', createContest);

router.post('/contests/:contestId/questions', addQuestionToContest);

module.exports = router;
