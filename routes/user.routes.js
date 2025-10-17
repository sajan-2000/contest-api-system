const express = require('express');
const { getHistory, getPrizes, register, login } = require('../controllers/user.controller');

const { isAuthenticated } = require('../middleware/auth.middleware');

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/history', isAuthenticated, getHistory);
router.get('/prizes', isAuthenticated, getPrizes);

module.exports = router;