CREATE TABLE IF NOT EXISTS submissions (
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    contest_id UUID NOT NULL REFERENCES contests(contest_id) ON DELETE CASCADE,
    score INT NOT NULL,
    user_answers JSONB NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, contest_id)
);
