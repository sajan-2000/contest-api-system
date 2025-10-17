const { getLeaderboard } = require('../models/contest.model');

async function getContestLeaderboardService({ contestId }) {
  const leaderboard = await getLeaderboard(contestId);
  return leaderboard;
}

module.exports = { getContestLeaderboardService };


