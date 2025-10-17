const { createContestService, addQuestionToContestService } = require('../services/admin.service');

async function createContest(req, res, next) {
  try {
    const contest = await createContestService(req.body || {});
    return res.status(201).json({ contest });
  } catch (err) {
    return next(err);
  }
}

async function addQuestionToContest(req, res, next) {
  try {
    const result = await addQuestionToContestService({
      contestId: req.params.contestId,
      ...req.body
    });
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createContest,
  addQuestionToContest,
};
