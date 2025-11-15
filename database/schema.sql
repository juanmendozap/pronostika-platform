-- Create database schema for Pronostika betting platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    points INTEGER DEFAULT 1000 NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bet categories table
CREATE TABLE bet_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bets table
CREATE TABLE bets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES bet_categories(id),
    total_pool INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'resolved', 'cancelled')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    winning_option_id UUID
);

-- Bet options table
CREATE TABLE bet_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bet_id UUID REFERENCES bets(id) ON DELETE CASCADE,
    text VARCHAR(255) NOT NULL,
    odds DECIMAL(10,2) DEFAULT 2.00,
    total_staked INTEGER DEFAULT 0,
    is_winner BOOLEAN DEFAULT FALSE
);

-- User bets table
CREATE TABLE user_bets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    bet_id UUID REFERENCES bets(id),
    option_id UUID REFERENCES bet_options(id),
    amount INTEGER NOT NULL,
    potential_winnings INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'won', 'lost', 'refunded')),
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('initial_points', 'bet_placed', 'bet_won', 'bet_refunded', 'admin_adjustment')),
    amount INTEGER NOT NULL,
    description TEXT,
    related_bet_id UUID REFERENCES bets(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_bets_category ON bets(category_id);
CREATE INDEX idx_bets_status ON bets(status);
CREATE INDEX idx_bets_created_at ON bets(created_at);
CREATE INDEX idx_user_bets_user ON user_bets(user_id);
CREATE INDEX idx_user_bets_bet ON user_bets(bet_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);

-- Functions to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bet_categories_updated_at BEFORE UPDATE ON bet_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bets_updated_at BEFORE UPDATE ON bets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update bet totals when user bets are placed
CREATE OR REPLACE FUNCTION update_bet_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Update option total staked
    UPDATE bet_options 
    SET total_staked = (
        SELECT COALESCE(SUM(amount), 0) 
        FROM user_bets 
        WHERE option_id = NEW.option_id AND status = 'active'
    )
    WHERE id = NEW.option_id;
    
    -- Update bet total pool
    UPDATE bets 
    SET total_pool = (
        SELECT COALESCE(SUM(ub.amount), 0)
        FROM user_bets ub
        WHERE ub.bet_id = NEW.bet_id AND ub.status = 'active'
    )
    WHERE id = NEW.bet_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating bet totals
CREATE TRIGGER update_bet_totals_trigger AFTER INSERT ON user_bets
    FOR EACH ROW EXECUTE FUNCTION update_bet_totals();