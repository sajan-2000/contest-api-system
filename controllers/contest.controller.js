const { listContestsService, getContestService, submitAnswersService } = require('../services/contest.service');

// List all contests
async function listContests(req, res, next) {
  try {
    const role = req.user?.role || 'Guest';
    console.log('role', role);
    const contests = await listContestsService(role);
    return res.json({ contests });
  } catch (err) {
    return next(err);
  }
}

// Get a contest with questions/options
async function getContest(req, res, next) {
  try {
    const contest = await getContestService({ contestId: req.params.contestId, role: req.user.role });
    return res.json({ contest });
  } catch (err) {
    return next(err);
  }
}

// Submit answers to a contest, calculates score and stores submission
async function submitAnswers(req, res, next) {
  try {
    const submission = await submitAnswersService({
      contestId: req.params.contestId,
      userId: req.user.user_id,
      role: req.user.role,
      userAnswers: req.body?.answers || {},
    });
    return res.status(201).json({ submission });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listContests, getContest, submitAnswers };


