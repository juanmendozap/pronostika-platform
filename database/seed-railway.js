const { Client } = require('pg');

// Railway database connection
const client = new Client({
  connectionString: 'postgresql://postgres:GekmdnNLRAibcpBttYEeqkfZGlSajiBV@tramway.proxy.rlwy.net:15989/railway'
});

async function seedDatabase() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Insert categories
    const categories = [
      ['Sports', 'Sports-related betting markets including football, basketball, tennis, etc.', '#3B82F6'],
      ['Politics', 'Political events, elections, and policy predictions', '#EF4444'],
      ['Entertainment', 'Movies, TV shows, awards, and celebrity events', '#8B5CF6'],
      ['Technology', 'Tech company performance, product launches, and industry trends', '#10B981'],
      ['Cryptocurrency', 'Crypto prices, blockchain adoption, and DeFi events', '#F59E0B'],
      ['Weather', 'Weather predictions and climate-related events', '#06B6D4'],
      ['Social Media', 'Social media trends, viral content, and platform changes', '#F97316']
    ];

    console.log('Inserting categories...');
    for (const [name, description, color] of categories) {
      await client.query(
        'INSERT INTO categories (name, description, color) VALUES ($1, $2, $3)',
        [name, description, color]
      );
    }

    // Insert admin user (password: admin123)
    console.log('Inserting admin user...');
    await client.query(
      'INSERT INTO users (email, username, password_hash, points, is_admin) VALUES ($1, $2, $3, $4, $5)',
      ['admin@pronostika.com', 'admin', '$2b$12$LQv3c1yqBwPVT6E8zKjX4FOcNDpCJRZelOQJJ8WzYQUJJJ8WzYQUJJ', 10000, true]
    );

    // Insert sample users (password: user123)
    console.log('Inserting sample users...');
    const users = [
      ['user1@example.com', 'bettor1', 900],
      ['user2@example.com', 'bettor2', 950],
      ['user3@example.com', 'bettor3', 1000]
    ];

    for (const [email, username, points] of users) {
      await client.query(
        'INSERT INTO users (email, username, password_hash, points) VALUES ($1, $2, $3, $4)',
        [email, username, '$2b$12$LQv3c1yqBwPVT6E8zKjX4FOcNDpCJRZelOQJJ8WzYQUJJJ8WzYQUJJ', points]
      );
    }

    // Insert sample bets
    console.log('Inserting sample bets...');
    await client.query(
      'INSERT INTO bets (title, description, category_id, creator_id, end_date, status) VALUES ($1, $2, $3, $4, $5, $6)',
      ['Will Liverpool win the Premier League this season?', 'Prediction market for Liverpool FC to win the 2024-25 Premier League title', 1, 1, '2025-05-25 23:59:59', 'open']
    );

    await client.query(
      'INSERT INTO bets (title, description, category_id, creator_id, end_date, status) VALUES ($1, $2, $3, $4, $5, $6)',
      ['Will the next iPhone have a foldable screen?', 'Prediction about Apple releasing a foldable iPhone in their next major release', 4, 1, '2025-09-15 23:59:59', 'open']
    );

    await client.query(
      'INSERT INTO bets (title, description, category_id, creator_id, end_date, status) VALUES ($1, $2, $3, $4, $5, $6)',
      ['Will Bitcoin reach $100,000 by end of 2024?', 'Cryptocurrency price prediction for Bitcoin reaching six-figure territory', 5, 1, '2024-12-31 23:59:59', 'closed']
    );

    // Insert bet options
    console.log('Inserting bet options...');
    await client.query('INSERT INTO bet_options (bet_id, option_text, odds) VALUES (1, $1, $2)', ['Yes', 2.5]);
    await client.query('INSERT INTO bet_options (bet_id, option_text, odds) VALUES (1, $1, $2)', ['No', 1.5]);
    
    await client.query('INSERT INTO bet_options (bet_id, option_text, odds) VALUES (2, $1, $2)', ['Yes, it will be foldable', 3.0]);
    await client.query('INSERT INTO bet_options (bet_id, option_text, odds) VALUES (2, $1, $2)', ['No, traditional design', 1.3]);
    
    await client.query('INSERT INTO bet_options (bet_id, option_text, odds) VALUES (3, $1, $2)', ['Yes, above $100k', 2.0]);
    await client.query('INSERT INTO bet_options (bet_id, option_text, odds) VALUES (3, $1, $2)', ['No, below $100k', 2.0]);

    // Insert transactions
    console.log('Inserting transactions...');
    await client.query('INSERT INTO transactions (user_id, type, amount, description) VALUES (1, $1, $2, $3)', ['initial_points', 10000, 'Admin account initial points']);
    await client.query('INSERT INTO transactions (user_id, type, amount, description) VALUES (2, $1, $2, $3)', ['initial_points', 1000, 'Welcome bonus points']);
    await client.query('INSERT INTO transactions (user_id, type, amount, description) VALUES (3, $1, $2, $3)', ['initial_points', 1000, 'Welcome bonus points']);
    await client.query('INSERT INTO transactions (user_id, type, amount, description) VALUES (4, $1, $2, $3)', ['initial_points', 1000, 'Welcome bonus points']);

    console.log('✅ Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.end();
  }
}

seedDatabase();