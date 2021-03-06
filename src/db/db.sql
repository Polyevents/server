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
		google_uid VARCHAR UNIQUE NOT NULL,
		-- Username should be all small, can only contain an underscore, number and alphabets
    username VARCHAR UNIQUE NOT NULL, 
		-- Store full name in all small
    full_name TEXT NOT NULL,
    profile_image VARCHAR NOT NULL,
    markets_followed VARCHAR[] NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE user_roles(
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    user_id VARCHAR UNIQUE NOT NULL REFERENCES users(id),
  	-- role_type: admin/user
		role_type TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE referral_codes (
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    user_id VARCHAR UNIQUE NOT NULL REFERENCES users(id),
    code VARCHAR UNIQUE NOT NULL,
    users_joined VARCHAR[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE markets (
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    image_link VARCHAR NOT NULL,
	-- store market name in small letters
    name TEXT NOT NULL,
    volume NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE events (
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    market_id VARCHAR NOT NULL REFERENCES markets(id),
    image_link VARCHAR NOT NULL,
    question_text TEXT NOT NULL,
    resolve_date TIMESTAMPTZ NOT NULL,
    bid_close_date TIMESTAMPTZ NOT NULL,
    source_link VARCHAR NOT NULL,
    yes_price NUMERIC(10, 2) NOT NULL DEFAULT 50,
    no_price NUMERIC(10, 2) NOT NULL DEFAULT 50,
    volume NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_resolved BOOLEAN DEFAULT FALSE,
    answer BOOLEAN DEFAULT NULL,
    remark TEXT DEFAULT NULL,
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- When a user clicks sell, check if he has enough tokens to sell and if the tokens after selling go to 0 then pop the row
CREATE TABLE holdings (
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    event_id VARCHAR REFERENCES events(id),
    token_type BOOLEAN NOT NULL,
    number_of_tokens INT NOT NULL,
		is_resolved BOOLEAN DEFAULT FALSE,
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
    token_type BOOLEAN NOT NULL,
    decision_type BOOLEAN NOT NULL,
    yes_price NUMERIC(10,2) NOT NULL,
    no_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE news(
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    source TEXT NOT NULL,
    news_link VARCHAR NOT NULL,
    image_link VARCHAR NOT NULL,
    heading TEXT NOT NULL,
    published_at TIMESTAMP NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- CREATE TABLE transactions(
-- 		id VARCHAR UNIQUE NOT NULL,
-- 		user_id VARCHAR NOT NULL,
-- 		event_id VARCHAR NOT NULL,
-- 		total_amount NUMERIC(10,2) NOT NULL,
-- 		is_credited BOOLEAN NOT NULL,
-- 		number_of_tokens INT NOT NULL,
-- 		token_type BOOLEAN NOT NULL,
--     decision_type BOOLEAN NOT NULL,
-- 		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--     updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );

DELETE FROM news WHERE published_at < '2021-06-14T16:30:00.000Z';
