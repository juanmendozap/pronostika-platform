-- Create database schema for Pronostika
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    points INTEGER DEFAULT 1000,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    creator_id INTEGER REFERENCES users(id),
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    resolution VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bet_options (
    id SERIAL PRIMARY KEY,
    bet_id INTEGER REFERENCES bets(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL,
    odds DECIMAL(10,2) DEFAULT 2.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_bets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    bet_id INTEGER REFERENCES bets(id),
    option_id INTEGER REFERENCES bet_options(id),
    amount INTEGER NOT NULL,
    potential_winnings INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, description, color) VALUES
('Sports', 'Sports-related predictions and events', '#10B981'),
('Politics', 'Political events and elections', '#EF4444'),
('Social', 'Social media trends and celebrity news', '#8B5CF6'),
('Others', 'Miscellaneous predictions', '#6B7280')
ON CONFLICT DO NOTHING;

-- Insert admin user (password: admin123)
INSERT INTO users (email, username, password_hash, points, is_admin) VALUES
('admin@pronostika.com', 'admin', '$2a$12$LQv3c1yqBWVHxkd0LXFqTOHcsv.3F9U3pZfmEP4b3QJ0f7w3F9U3p', 10000, true)
ON CONFLICT DO NOTHING;

-- Insert test user (password: user123)
INSERT INTO users (email, username, password_hash, points, is_admin) VALUES
('user1@example.com', 'user1', '$2a$12$LQv3c1yqBWVHxkd0LXFqTOHcsv.3F9U3pZfmEP4b3QJ0f7w3F9U3p', 1000, false)
ON CONFLICT DO NOTHING;