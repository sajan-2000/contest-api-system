const { pool } = require('../config/db');

async function getContestsForAccess(userRole) {
  if (userRole === 'VIP') {
    console.log('VIP user role');
    const { rows } = await pool.query('SELECT * FROM contests ORDER BY start_time DESC');
    return rows;
  }
  const { rows } = await pool.query(
    "SELECT * FROM contests WHERE access_level='Normal' ORDER BY start_time DESC"
  );
  return rows;
}

async function getContestById(contestId) {
  const { rows } = await pool.query(
    'SELECT * FROM contests WHERE contest_id=$1',
    [contestId]
  );
  return rows[0] || null;
}

async function getContestWithQuestions(contestId) {
  const contest = await getContestById(contestId);
  if (!contest) return null;
  const questionsRes = await pool.query(
    'SELECT * FROM questions WHERE contest_id=$1',
    [contestId]
  );
  const questionIds = questionsRes.rows.map(q => q.question_id);
  let optionsByQuestion = {};
  if (questionIds.length) {
    const optsRes = await pool.query(
      'SELECT * FROM question_options WHERE question_id = ANY($1::uuid[])',
      [questionIds]
    );
    optionsByQuestion = optsRes.rows.reduce((acc, o) => {
      if (!acc[o.question_id]) acc[o.question_id] = [];
      acc[o.question_id].push(o);
      return acc;
    }, {});
  }
  const questions = questionsRes.rows.map(q => ({
    ...q,
    options: optionsByQuestion[q.question_id] || [],
  }));
  return { ...contest, questions };
}

function userHasAccessToContest(userRole, accessLevel) {
  if (accessLevel === 'Normal') return true;
  return userRole === 'VIP';
}

async function hasUserSubmitted(userId, contestId) {
  const { rows } = await pool.query(
    'SELECT 1 FROM submissions WHERE user_id=$1 AND contest_id=$2 LIMIT 1',
    [userId, contestId]
  );
  return rows.length > 0;
}

async function insertSubmission({ userId, contestId, score, userAnswers }) {
  const query = `
    INSERT INTO submissions (user_id, contest_id, score, user_answers)
    VALUES ($1, $2, $3, $4)
    RETURNING submission_id, score, submitted_at;
  `;
  const values = [userId, contestId, score, userAnswers];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function getLeaderboard(contestId) {
  const query = `
    SELECT r.rnk as user_rank, u.username, r.score
    FROM (
      SELECT s.user_id, s.score,
             DENSE_RANK() OVER (ORDER BY s.score DESC) as rnk
      FROM submissions s
      WHERE s.contest_id = $1
    ) r
    JOIN users u ON u.user_id = r.user_id
    ORDER BY r.rnk ASC, u.username ASC;
  `;
  const { rows } = await pool.query(query, [contestId]);
  return rows;
}

module.exports = {
  getContestsForAccess,
  getContestById,
  getContestWithQuestions,
  userHasAccessToContest,
  hasUserSubmitted,
  insertSubmission,
  getLeaderboard,
};


