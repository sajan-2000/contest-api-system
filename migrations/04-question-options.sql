CREATE TABLE IF NOT EXISTS question_options (
    option_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL
);
