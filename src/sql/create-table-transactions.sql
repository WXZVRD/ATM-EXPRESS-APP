CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    from_player UUID REFERENCES players(id),
    to_player UUID REFERENCES players(id),
    amount NUMERIC(12, 2) NOT NULL CHECK(amount > 0),
    type VARCHAR(20) CHECK (type IN ('withdraw', 'deposit', 'transfer')),
    created_at TIMESTAMP DEFAULT NOW()
);
