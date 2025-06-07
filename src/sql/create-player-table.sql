CREATE TABLE players (
    id UUID PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    balance NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK(balance >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);