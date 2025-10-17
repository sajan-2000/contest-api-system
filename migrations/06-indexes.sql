-- USERS: fast login lookups + uniqueness enforcement on email
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- QUESTIONS: speed fetching all questions for a contest
CREATE INDEX IF NOT EXISTS idx_questions_contest_id ON questions(contest_id);

-- QUESTION_OPTIONS: speed fetching options for a question
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);

-- SUBMISSIONS: speed fetching a user's submissions
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);

-- SUBMISSIONS (leaderboard): optimize contest leaderboard queries
-- Enables quick retrieval of submissions for a contest ordered by score desc
CREATE INDEX IF NOT EXISTS idx_submissions_leaderboard ON submissions(contest_id, score DESC);
