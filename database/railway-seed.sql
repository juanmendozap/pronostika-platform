-- Railway Database Seed Data for Pronostika Platform
-- This file contains sample data to initialize the database

-- Insert sample categories
INSERT INTO categories (name, description, color) VALUES
    ('Sports', 'Sports-related betting markets including football, basketball, tennis, etc.', '#3B82F6'),
    ('Politics', 'Political events, elections, and policy predictions', '#EF4444'),
    ('Entertainment', 'Movies, TV shows, awards, and celebrity events', '#8B5CF6'),
    ('Technology', 'Tech company performance, product launches, and industry trends', '#10B981'),
    ('Cryptocurrency', 'Crypto prices, blockchain adoption, and DeFi events', '#F59E0B'),
    ('Weather', 'Weather predictions and climate-related events', '#06B6D4'),
    ('Social Media', 'Social media trends, viral content, and platform changes', '#F97316');

-- Insert an admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (email, username, password_hash, points, is_admin) VALUES
    ('admin@pronostika.com', 'admin', '$2b$12$LQv3c1yqBwPVT6E8zKjX4FOcNDpCJRZelOQJJ8WzYQUJJJ8WzYQUJJ', 10000, TRUE);

-- Insert sample regular users (password: user123)
-- Password hash for 'user123' using bcrypt
INSERT INTO users (email, username, password_hash, points) VALUES
    ('user1@example.com', 'bettor1', '$2b$12$LQv3c1yqBwPVT6E8zKjX4FOcNDpCJRZelOQJJ8WzYQUJJJ8WzYQUJJ', 900),
    ('user2@example.com', 'bettor2', '$2b$12$LQv3c1yqBwPVT6E8zKjX4FOcNDpCJRZelOQJJ8WzYQUJJJ8WzYQUJJ', 950),
    ('user3@example.com', 'bettor3', '$2b$12$LQv3c1yqBwPVT6E8zKjX4FOcNDpCJRZelOQJJ8WzYQUJJJ8WzYQUJJ', 1000);

-- Insert sample bets
INSERT INTO bets (title, description, category_id, creator_id, end_date, status) VALUES
    (
        'Will Liverpool win the Premier League this season?',
        'Prediction market for Liverpool FC to win the 2024-25 Premier League title',
        1, -- Sports category
        1, -- Admin user
        '2025-05-25 23:59:59',
        'open'
    ),
    (
        'Will the next iPhone have a foldable screen?',
        'Prediction about Apple releasing a foldable iPhone in their next major release',
        4, -- Technology category
        1, -- Admin user
        '2025-09-15 23:59:59',
        'open'
    ),
    (
        'Will Bitcoin reach $100,000 by end of 2024?',
        'Cryptocurrency price prediction for Bitcoin reaching six-figure territory',
        5, -- Cryptocurrency category
        1, -- Admin user
        '2024-12-31 23:59:59',
        'closed'
    );

-- Insert bet options for Liverpool Premier League bet
INSERT INTO bet_options (bet_id, option_text, odds) VALUES
    (1, 'Yes', 2.5),
    (1, 'No', 1.5);

-- Insert bet options for iPhone foldable screen bet
INSERT INTO bet_options (bet_id, option_text, odds) VALUES
    (2, 'Yes, it will be foldable', 3.0),
    (2, 'No, traditional design', 1.3);

-- Insert bet options for Bitcoin price bet
INSERT INTO bet_options (bet_id, option_text, odds) VALUES
    (3, 'Yes, above $100k', 2.0),
    (3, 'No, below $100k', 2.0);

-- Insert sample user bets
INSERT INTO user_bets (user_id, bet_id, option_id, amount, potential_winnings, status) VALUES
    (2, 1, 1, 100, 250, 'active'), -- bettor1 bets on Liverpool to win
    (3, 3, 3, 50, 100, 'active');   -- bettor2 bets on Bitcoin above $100k

-- Insert initial transaction records
INSERT INTO transactions (user_id, type, amount, description) VALUES
    (1, 'initial_points', 10000, 'Admin account initial points'),
    (2, 'initial_points', 1000, 'Welcome bonus points'),
    (3, 'initial_points', 1000, 'Welcome bonus points'),
    (4, 'initial_points', 1000, 'Welcome bonus points');

-- Insert bet placement transactions
INSERT INTO transactions (user_id, type, amount, description, reference_id) VALUES
    (2, 'bet_placed', -100, 'Bet on Liverpool Premier League win', 1),
    (3, 'bet_placed', -50, 'Bet on Bitcoin reaching $100k', 3);