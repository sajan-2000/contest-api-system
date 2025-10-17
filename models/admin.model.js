const { pool } = require('../config/db');

async function createContest({ name, description, start_time, end_time, prize_info, access_level }) {
  const query = `
    INSERT INTO contests (name, description, start_time, end_time, prize_info, access_level)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING contest_id, name, description, start_time, end_time, prize_info, access_level
  `;
  
  const values = [name, description, start_time, end_time, prize_info || null, access_level || 'Normal'];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function addQuestion({ contestId, question_text, question_type, correct_answers }) {
  const query = `
    INSERT INTO questions (contest_id, question_text, question_type, correct_answers)
    VALUES ($1, $2, $3, $4)
    RETURNING question_id
  `;
  const values = [contestId, question_text, question_type, JSON.stringify(correct_answers)];
  const { rows } = await pool.query(query, values);
  return rows[0].question_id;
}

async function addQuestionOption({ questionId, optionText }) {
  const query = `
    INSERT INTO question_options (question_id, option_text)
    VALUES ($1, $2)
  `;
  await pool.query(query, [questionId, optionText]);
}

async function addQuestionOptions({ questionId, options }) {
  if (options && options.length > 0) {
    for (const optionText of options) {
      await addQuestionOption({ questionId, optionText });
    }
  }
}

async function createQuestionWithOptions({ contestId, question_text, question_type, correct_answers, options }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const questionId = await addQuestion({ contestId, question_text, question_type, correct_answers });
    await addQuestionOptions({ questionId, options });
    
    await client.query('COMMIT');
    return { question_id: questionId, message: 'Question added successfully' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  createContest,
  createQuestionWithOptions,
};
