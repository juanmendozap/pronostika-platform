# Pronostika - Betting Platform

A decentralized betting platform similar to Polymarket, built with React and Node.js.

## Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Point System**: Users start with 1000 points for betting
- **Admin Controls**: Admins can manage bet categories and monitor all bets
- **Flexible Betting**: Support for various bet types (sports, social, etc.)
- **Real-time Updates**: Live bet tracking and results
- **Comprehensive Tracking**: Full audit trail of all betting activity

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Real-time**: Socket.io
- **Styling**: Tailwind CSS

## Project Structure

```
pronostika/
├── frontend/           # React frontend application
├── backend/            # Express.js API server
├── database/           # Database scripts and migrations
├── shared/             # Shared TypeScript types and utilities
└── docs/               # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install:all
   ```

3. Set up the database:
   ```bash
   npm run db:setup
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Production Deployment

For production deployment to your domain (pronostika.com.mx), see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## Environment Variables

Create `.env` files in both `frontend` and `backend` directories:
- `.env` - Development configuration  
- `.env.production` - Production configuration (already created)

## Development

- `npm run dev` - Start both frontend and backend in development mode
- `npm run backend:dev` - Start only the backend server
- `npm run frontend:dev` - Start only the frontend application
- `npm run test` - Run all tests
- `npm run build` - Build both applications for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details