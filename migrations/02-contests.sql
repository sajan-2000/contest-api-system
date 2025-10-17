CREATE TABLE IF NOT EXISTS contests (
    contest_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    prize_info VARCHAR(255),
    access_level VARCHAR(10) NOT NULL DEFAULT 'Normal'
);
