const { getHistoryService, getPrizesService, registerUserService, loginUserService } = require('../services/user.service');

// Get user history: completed and in-progress contests
async function getHistory(req, res, next) {
  try {
    const data = await getHistoryService({ userId: req.user.user_id, role: req.user.role });
    return res.json(data);
  } catch (err) {
    return next(err);
  }
}

// Get prizes won by user (rank 1) from completed contests
async function getPrizes(req, res, next) {
  try {
    const prizes = await getPrizesService({ userId: req.user.user_id });
    return res.json({ prizes });
  } catch (err) {
    return next(err);
  }
}
// Register a new user
async function register(req, res, next) {
  try {
    const user = await registerUserService(req.body);
    return res.status(201).json({ user });
  } catch (err) { return next(err); }
}

// Login a user
async function login(req, res, next) {
  try {
    const token = await loginUserService(req.body);
    return res.json({ token });
  } catch (err) { return next(err); }
}


module.exports = { getHistory, getPrizes, register, login };