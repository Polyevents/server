-- Links are varchar
-- Use Timestamptz
-- yes, no, volume are NUMERIC(10, 2)
-- Booleans are TRUE or FALSE
-- yes is TRUE no is FALSE
-- BUY is TRUE SELL is FALSE
-- decision_type is Buy/Sell TRUE/FALSE
-- token_type is Yes/No TRUE/FALSE

CREATE TABLE users (
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    age SMALLINT NOT NULL,
    profile_image VARCHAR NOT NULL,
    markets_followed VARCHAR[] NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE referral_codes (
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    user_id VARCHAR UNIQUE NOT NULL REFERENCES users(id),
    code VARCHAR(6) UNIQUE NOT NULL,
    users_joined VARCHAR[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE markets (
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    image_link VARCHAR NOT NULL,
    name TEXT NOT NULL,
    volume NUMERIC(10, 2) DEFAULT 0,
    followed_by VARCHAR[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE events (
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    market_id VARCHAR NOT NULL REFERENCES markets(id),
    image_link VARCHAR NOT NULL,
    question_text TEXT NOT NULL,
    yes_price NUMERIC(10, 2) NOT NULL DEFAULT 50,
    no_price NUMERIC(10, 2) NOT NULL DEFAULT 50,
    volume NUMERIC(10, 2) NOT NULL DEFAULT 0,
    resolve_date TIMESTAMPTZ NOT NULL,
    bid_close_date TIMESTAMPTZ NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    answer BOOLEAN DEFAULT NULL,
    source VARCHAR NOT NULL,
    remark TEXT NOT NULL,
    bids_by VARCHAR[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE comments (
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    liked_by VARCHAR[],
    comment_text TEXT NOT NULL,
    event_id VARCHAR REFERENCES events(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE portfolios (
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    user_id VARCHAR UNIQUE NOT NULL REFERENCES users(id),
    wallet_balance NUMERIC(10, 2) NOT NULL DEFAULT 500,
    total_profit NUMERIC(10, 2) NOT NULL DEFAULT 0,
    portfolio_value NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE holdings (
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    event_id VARCHAR REFERENCES events(id),
    token_type BOOLEAN NOT NULL,
    number_of_tokens INT[] NOT NULL,
    price_of_token NUMERIC(10, 2)[] NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE history_of_holdings (
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    event_id VARCHAR REFERENCES events(id),
    token_type BOOLEAN NOT NULL,
    number_of_tokens INT[] NOT NULL,
    price_of_token NUMERIC(10, 2)[] NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE requested_events(
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    market_id VARCHAR NOT NULL REFERENCES markets(id),
    event_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE bids (
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    event_id VARCHAR NOT NULL REFERENCES events(id),
    number_of_tokens INT NOT NULL,
    price_of_token NUMERIC(10,2) NOT NULL,
    token_type BOOLEAN NOT NULL,
    decision_type BOOLEAN NOT NULL,
    yes_price NUMERIC(10,2) NOT NULL,
    no_price NUMERIC(10,2) NOT NULL,
    previous_wallet_balance NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE 
referral_codes, 
portfolios, 
users, 
markets, 
events, 
holdings, 
history_of_holdings, 
bids,
requested_events,
comments;
