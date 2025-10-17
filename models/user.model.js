const { pool } = require('../config/db');


async function createUser({ username, email, passwordHash, role = 'Normal' }) {
  const query = `
    INSERT INTO users (username, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id, username, email, role, created_at;
  `;
  const values = [username, email, passwordHash, role];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE email=$1 LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

async function findByUsername(username) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE username=$1 LIMIT 1',
    [username]
  );
  return rows[0] || null;
}

async function getUserById(userId) {
  const { rows } = await pool.query(
    'SELECT user_id, username, email, role, created_at FROM users WHERE user_id=$1',
    [userId]
  );
  return rows[0] || null;
}


async function getCompletedSubmissions(userId) {
  const query = `
    SELECT s.submission_id, s.score, s.submitted_at,
           c.contest_id, c.name, c.description, c.prize_info, c.start_time, c.end_time
    FROM submissions s
    JOIN contests c ON c.contest_id = s.contest_id
    WHERE s.user_id = $1
    ORDER BY s.submitted_at DESC;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
}


async function getInProgressContests(userId, userRole) {
  const query = `
    SELECT c.*
    FROM contests c
    WHERE NOW() BETWEEN c.start_time AND c.end_time
      AND (c.access_level = 'Normal' OR $2 = 'VIP')
      AND NOT EXISTS (
        SELECT 1 FROM submissions s WHERE s.user_id = $1 AND s.contest_id = c.contest_id
      )
    ORDER BY c.start_time ASC;
  `;
  const { rows } = await pool.query(query, [userId, userRole]);
  return rows;
}


async function getPrizesWon(userId) {
  const query = `
    WITH ranked AS (
      SELECT s.*, DENSE_RANK() OVER (PARTITION BY s.contest_id ORDER BY s.score DESC) as rnk
      FROM submissions s
    )
    SELECT c.contest_id, c.name, c.prize_info, r.score
    FROM ranked r
    JOIN contests c ON c.contest_id = r.contest_id
    WHERE r.user_id = $1 AND r.rnk = 1 AND c.prize_info IS NOT NULL;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
}

module.exports = {
  createUser,
  findByEmail,
  findByUsername,
  getUserById,
  getCompletedSubmissions,
  getInProgressContests,
  getPrizesWon,
};


