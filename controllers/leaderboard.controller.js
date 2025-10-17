const { getContestLeaderboardService } = require('../services/leaderboard.service');

//Public leaderboard for a contest
async function getContestLeaderboard(req, res, next) {
  try {
    const leaderboard = await getContestLeaderboardService({ contestId: req.params.contestId });
    return res.json({ leaderboard });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getContestLeaderboard };


