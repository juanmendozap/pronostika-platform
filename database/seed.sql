-- Sample data for Pronostika betting platform

-- Insert sample bet categories
INSERT INTO bet_categories (name, description) VALUES
    ('Sports', 'Sports-related betting markets including football, basketball, tennis, etc.'),
    ('Politics', 'Political events, elections, and policy predictions'),
    ('Entertainment', 'Movies, TV shows, awards, and celebrity events'),
    ('Technology', 'Tech company performance, product launches, and industry trends'),
    ('Cryptocurrency', 'Crypto prices, blockchain adoption, and DeFi events'),
    ('Weather', 'Weather predictions and climate-related events'),
    ('Social Media', 'Social media trends, viral content, and platform changes');

-- Insert an admin user (password: admin123)
INSERT INTO users (email, username, password_hash, points, is_admin) VALUES
    ('admin@pronostika.com', 'admin', '$2b$12$LQv3c1yqBw7V6E8zKjX4FOcNDpCJRZelOQJJ8WzYQUJJJ8WzYQUJJ', 10000, TRUE);

-- Insert sample regular users (password: user123)
INSERT INTO users (email, username, password_hash, points) VALUES
    ('user1@example.com', 'bettor1', '$2b$12$LQv3c1yqBw7V6E8zKjX4FOcNDpCJRZelOQJJ8WzYQUJJJ8WzYQUJJ', 1000),
    ('user2@example.com', 'bettor2', '$2b$12$LQv3c1yqBw7V6E8zKjX4FOcNDpCJRZelOQJJ8WzYQUJJJ8WzYQUJJ', 1000),
    ('user3@example.com', 'bettor3', '$2b$12$LQv3c1yqBw7V6E8zKjX4FOcNDpCJRZelOQJJ8WzYQUJJJ8WzYQUJJ', 1000);

-- Insert sample bets
INSERT INTO bets (title, description, category_id, created_by) VALUES
    (
        'Will Liverpool win the Premier League this season?',
        'Prediction market for Liverpool FC to win the 2024-25 Premier League title',
        (SELECT id FROM bet_categories WHERE name = 'Sports'),
        (SELECT id FROM users WHERE username = 'admin')
    ),
    (
        'Will the next iPhone have a foldable screen?',
        'Prediction about Apple releasing a foldable iPhone in their next major release',
        (SELECT id FROM bet_categories WHERE name = 'Technology'),
        (SELECT id FROM users WHERE username = 'admin')
    ),
    (
        'Will Bitcoin reach $100,000 by end of 2024?',
        'Cryptocurrency price prediction for Bitcoin reaching six-figure territory',
        (SELECT id FROM bet_categories WHERE name = 'Cryptocurrency'),
        (SELECT id FROM users WHERE username = 'admin')
    );

-- Insert bet options for Liverpool Premier League bet
INSERT INTO bet_options (bet_id, text, odds) VALUES
    ((SELECT id FROM bets WHERE title LIKE 'Will Liverpool win%'), 'Yes', 2.5),
    ((SELECT id FROM bets WHERE title LIKE 'Will Liverpool win%'), 'No', 1.5);

-- Insert bet options for iPhone foldable screen bet
INSERT INTO bet_options (bet_id, text, odds) VALUES
    ((SELECT id FROM bets WHERE title LIKE 'Will the next iPhone%'), 'Yes, it will be foldable', 3.0),
    ((SELECT id FROM bets WHERE title LIKE 'Will the next iPhone%'), 'No, traditional design', 1.3);

-- Insert bet options for Bitcoin price bet
INSERT INTO bet_options (bet_id, text, odds) VALUES
    ((SELECT id FROM bets WHERE title LIKE 'Will Bitcoin reach%'), 'Yes, above $100k', 2.0),
    ((SELECT id FROM bets WHERE title LIKE 'Will Bitcoin reach%'), 'No, below $100k', 2.0);

-- Insert sample user bets
INSERT INTO user_bets (user_id, bet_id, option_id, amount, potential_winnings) VALUES
    (
        (SELECT id FROM users WHERE username = 'bettor1'),
        (SELECT id FROM bets WHERE title LIKE 'Will Liverpool win%'),
        (SELECT id FROM bet_options WHERE text = 'Yes' AND bet_id = (SELECT id FROM bets WHERE title LIKE 'Will Liverpool win%')),
        100,
        250
    ),
    (
        (SELECT id FROM users WHERE username = 'bettor2'),
        (SELECT id FROM bets WHERE title LIKE 'Will Bitcoin reach%'),
        (SELECT id FROM bet_options WHERE text = 'Yes, above $100k' AND bet_id = (SELECT id FROM bets WHERE title LIKE 'Will Bitcoin reach%')),
        50,
        100
    );

-- Insert initial transaction records
INSERT INTO transactions (user_id, type, amount, description) VALUES
    ((SELECT id FROM users WHERE username = 'admin'), 'initial_points', 10000, 'Admin account initial points'),
    ((SELECT id FROM users WHERE username = 'bettor1'), 'initial_points', 1000, 'Welcome bonus points'),
    ((SELECT id FROM users WHERE username = 'bettor2'), 'initial_points', 1000, 'Welcome bonus points'),
    ((SELECT id FROM users WHERE username = 'bettor3'), 'initial_points', 1000, 'Welcome bonus points');

-- Insert bet placement transactions
INSERT INTO transactions (user_id, type, amount, description, related_bet_id) VALUES
    (
        (SELECT id FROM users WHERE username = 'bettor1'),
        'bet_placed',
        -100,
        'Bet on Liverpool Premier League win',
        (SELECT id FROM bets WHERE title LIKE 'Will Liverpool win%')
    ),
    (
        (SELECT id FROM users WHERE username = 'bettor2'),
        'bet_placed',
        -50,
        'Bet on Bitcoin reaching $100k',
        (SELECT id FROM bets WHERE title LIKE 'Will Bitcoin reach%')
    );

-- Update user points after bets
UPDATE users SET points = points - 100 WHERE username = 'bettor1';
UPDATE users SET points = points - 50 WHERE username = 'bettor2';