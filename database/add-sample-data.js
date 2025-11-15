const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pronostika',
  password: 'Hola1234*',
  port: 5432,
});

async function addSampleData() {
  const client = await pool.connect();
  
  try {
    console.log('Adding diverse sample bets for different categories...');

    // Get category IDs
    const categoriesResult = await client.query('SELECT id, name FROM bet_categories');
    const categories = {};
    categoriesResult.rows.forEach(cat => {
      categories[cat.name.toLowerCase()] = cat.id;
    });

    console.log('Available categories:', Object.keys(categories));

    // Sample bets data
    const sampleBets = [
      // Sports
      {
        category: 'sports',
        title: 'Will Lionel Messi win the 2024 Ballon d\'Or?',
        description: 'Betting on whether Lionel Messi will be awarded the Ballon d\'Or for 2024.',
        options: [
          { text: 'Yes', odds: 3.2 },
          { text: 'No', odds: 1.4 }
        ]
      },
      {
        category: 'sports',
        title: 'NBA 2024 Championship Winner',
        description: 'Which team will win the NBA 2024 championship?',
        options: [
          { text: 'Boston Celtics', odds: 2.8 },
          { text: 'Golden State Warriors', odds: 3.5 },
          { text: 'Los Angeles Lakers', odds: 4.1 },
          { text: 'Other Team', odds: 2.2 }
        ]
      },
      // Politics
      {
        category: 'politics',
        title: 'Will there be a US recession in 2024?',
        description: 'Will the United States enter an official recession (two consecutive quarters of negative GDP growth) in 2024?',
        options: [
          { text: 'Yes', odds: 2.1 },
          { text: 'No', odds: 1.9 }
        ]
      },
      {
        category: 'politics',
        title: 'Next UK Prime Minister',
        description: 'Who will be the next Prime Minister of the United Kingdom?',
        options: [
          { text: 'Rishi Sunak (continues)', odds: 1.8 },
          { text: 'Keir Starmer (Labour)', odds: 2.3 },
          { text: 'Other candidate', odds: 4.5 }
        ]
      },
      // Technology
      {
        category: 'technology',
        title: 'Will OpenAI release GPT-5 in 2024?',
        description: 'Will OpenAI officially release GPT-5 or its equivalent before the end of 2024?',
        options: [
          { text: 'Yes', odds: 1.7 },
          { text: 'No', odds: 2.4 }
        ]
      },
      {
        category: 'technology',
        title: 'Tesla Stock Price End of 2024',
        description: 'Will Tesla (TSLA) stock price be above $300 at the end of 2024?',
        options: [
          { text: 'Above $300', odds: 2.0 },
          { text: 'Below $300', odds: 2.0 }
        ]
      },
      // Cryptocurrency
      {
        category: 'cryptocurrency',
        title: 'Bitcoin Price Prediction 2024',
        description: 'Will Bitcoin (BTC) reach $100,000 USD before the end of 2024?',
        options: [
          { text: 'Yes, above $100,000', odds: 2.5 },
          { text: 'No, stays below $100,000', odds: 1.6 }
        ]
      },
      {
        category: 'cryptocurrency',
        title: 'Ethereum 2.0 Upgrade Impact',
        description: 'Will Ethereum (ETH) outperform Bitcoin (BTC) in 2024?',
        options: [
          { text: 'ETH outperforms BTC', odds: 1.9 },
          { text: 'BTC outperforms ETH', odds: 2.1 }
        ]
      },
      // Entertainment (if exists, otherwise skip)
      {
        category: 'entertainment',
        title: 'Oscars 2024 Best Picture',
        description: 'Which movie will win Best Picture at the 2024 Academy Awards?',
        options: [
          { text: 'Oppenheimer', odds: 1.5 },
          { text: 'Barbie', odds: 3.2 },
          { text: 'Killers of the Flower Moon', odds: 4.1 },
          { text: 'Other film', odds: 3.8 }
        ]
      }
    ];

    // Insert bets
    for (const bet of sampleBets) {
      const categoryId = categories[bet.category];
      if (!categoryId) {
        console.log(`Category '${bet.category}' not found, skipping bet: ${bet.title}`);
        continue;
      }

      // Insert bet
      const betResult = await client.query(`
        INSERT INTO bets (title, description, category_id, status)
        VALUES ($1, $2, $3, 'active')
        RETURNING id
      `, [bet.title, bet.description, categoryId]);

      const betId = betResult.rows[0].id;
      console.log(`Added bet: ${bet.title}`);

      // Insert bet options
      for (const option of bet.options) {
        await client.query(`
          INSERT INTO bet_options (bet_id, text, odds)
          VALUES ($1, $2, $3)
        `, [betId, option.text, option.odds]);
        console.log(`  - Option: ${option.text} (${option.odds}x)`);
      }
    }

    console.log('\n✅ Sample bets added successfully!');
    console.log('You can now see diverse betting options organized by categories.');

  } catch (error) {
    console.error('Error adding sample bets:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addSampleData();