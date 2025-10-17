const { getContestsForAccess, getContestWithQuestions, userHasAccessToContest, hasUserSubmitted, insertSubmission } = require('../models/contest.model');
const { calculateScore } = require('./scoring.service');

async function listContestsService(userRoleOrGuest) {
  const role = userRoleOrGuest || 'Guest';
  const contests = await getContestsForAccess(role === 'Guest' ? 'Normal' : role);
  return contests;
}

async function getContestService({ contestId, role }) {
  const data = await getContestWithQuestions(contestId);
  if (!data) {
    const err = new Error('Contest not found');
    err.status = 404;
    throw err;
  }
  if (!userHasAccessToContest(role, data.access_level)) {
    const err = new Error('Access denied for this contest');
    err.status = 403;
    throw err;
  }
  return data;
}

async function submitAnswersService({ contestId, userId, role, userAnswers }) {
  const data = await getContestWithQuestions(contestId);
  if (!data) {
    const err = new Error('Contest not found');
    err.status = 404;
    throw err;
  }
  if (!userHasAccessToContest(role, data.access_level)) {
    const err = new Error('Access denied for this contest');
    err.status = 403;
    throw err;
  }
  const already = await hasUserSubmitted(userId, contestId);
  if (already) {
    const err = new Error('Submission already exists');
    err.status = 409;
    throw err;
  }
  const questions = data.questions.map(q => ({
    question_id: q.question_id,
    question_type: q.question_type,
    correct_answers: q.correct_answers,
  }));
  const { score } = calculateScore(questions, userAnswers || {});
  const submission = await insertSubmission({ userId, contestId, score, userAnswers: userAnswers || {} });
  return submission;
}

module.exports = { listContestsService, getContestService, submitAnswersService };


