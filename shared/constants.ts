export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  PROFILE: '/api/auth/profile',
  
  // Users
  USERS: '/api/users',
  USER_BETS: '/api/users/:id/bets',
  USER_TRANSACTIONS: '/api/users/:id/transactions',
  
  // Bets
  BETS: '/api/bets',
  BET_DETAILS: '/api/bets/:id',
  PLACE_BET: '/api/bets/:id/place',
  RESOLVE_BET: '/api/bets/:id/resolve',
  
  // Categories
  CATEGORIES: '/api/categories',
  
  // Admin
  ADMIN_USERS: '/api/admin/users',
  ADMIN_BETS: '/api/admin/bets',
  ADMIN_CATEGORIES: '/api/admin/categories',
  ADMIN_STATS: '/api/admin/stats'
} as const;

export const SOCKET_EVENTS = {
  // Client to Server
  JOIN_BET: 'join_bet',
  LEAVE_BET: 'leave_bet',
  
  // Server to Client
  BET_UPDATED: 'bet_updated',
  BET_RESOLVED: 'bet_resolved',
  NEW_BET: 'new_bet',
  USER_BALANCE_UPDATED: 'user_balance_updated'
} as const;

export const APP_CONSTANTS = {
  INITIAL_USER_POINTS: 1000,
  MIN_BET_AMOUNT: 1,
  MAX_BET_AMOUNT: 500,
  JWT_EXPIRY: '7d',
  BCRYPT_ROUNDS: 12
} as const;