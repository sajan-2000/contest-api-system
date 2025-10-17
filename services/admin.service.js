const { createContest, createQuestionWithOptions } = require('../models/admin.model');

async function createContestService({ name, description, start_time, end_time, prize_info, access_level }) {
  if (!name || !start_time || !end_time) {
    const err = new Error('name, start_time, and end_time are required');
    err.status = 400; throw err;
  }
  return await createContest({ name, description, start_time, end_time, prize_info, access_level });
}

async function addQuestionToContestService({ contestId, question_text, question_type, correct_answers, options }) {
  if (!question_text || !question_type || !correct_answers) {
    const err = new Error('question_text, question_type, and correct_answers are required');
    err.status = 400; throw err;
  }
  return await createQuestionWithOptions({ contestId, question_text, question_type, correct_answers, options });
}

module.exports = {
  createContestService,
  addQuestionToContestService,
};
