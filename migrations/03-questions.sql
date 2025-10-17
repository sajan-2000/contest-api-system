CREATE TABLE IF NOT EXISTS questions (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id UUID NOT NULL REFERENCES contests(contest_id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL,
    correct_answers JSONB NOT NULL
);
