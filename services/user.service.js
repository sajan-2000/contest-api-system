const { getCompletedSubmissions, getInProgressContests, getPrizesWon, createUser, findByEmail, findByUsername } = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function registerUserService({ username, email, password, role }) {

  if (!username || !email || !password) {
    const err = new Error('username, email, and password are required');
    err.status = 400; throw err;
  }
  
  const existingEmail = await findByEmail(email);
  if (existingEmail) { const e = new Error('Email already in use'); e.status = 409; throw e; }

  const existingUsername = await findByUsername(username);
  if (existingUsername) { const e = new Error('Username already in use'); e.status = 409; throw e; }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = await createUser({ username, email, passwordHash, role: role === 'VIP' ? 'VIP' : role === 'Admin' ? 'Admin' : 'Normal' });
  return user;

}

async function loginUserService({ email, password }) {

  if (!email || !password) { const e = new Error('email and password are required'); e.status = 400; throw e; }
  const user = await findByEmail(email);

  if (!user) { const e = new Error('Invalid credentials'); e.status = 401; throw e; }
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) { const e = new Error('Invalid credentials'); e.status = 401; throw e; }
  const token = jwt.sign({ user_id: user.user_id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'changeme', { expiresIn: '7d' });
  return token;

}

async function getHistoryService({ userId, role }) {
  const [completed, inProgress] = await Promise.all([
    getCompletedSubmissions(userId),
    getInProgressContests(userId, role),
  ]);
  return { completed, inProgress };
}

async function getPrizesService({ userId }) {
  const prizes = await getPrizesWon(userId);
  return prizes;
}





module.exports = { getHistoryService, getPrizesService, registerUserService, loginUserService };
