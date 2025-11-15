export interface User {
  id: string;
  email: string;
  username: string;
  points: number;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BetCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bet {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  category?: BetCategory;
  options: BetOption[];
  totalPool: number;
  status: BetStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  winningOptionId?: string;
}

export interface BetOption {
  id: string;
  betId: string;
  text: string;
  odds: number;
  totalStaked: number;
  isWinner?: boolean;
}

export interface UserBet {
  id: string;
  userId: string;
  betId: string;
  optionId: string;
  amount: number;
  potentialWinnings: number;
  status: UserBetStatus;
  placedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  relatedBetId?: string;
  createdAt: Date;
}

export enum BetStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  RESOLVED = 'resolved',
  CANCELLED = 'cancelled'
}

export enum UserBetStatus {
  ACTIVE = 'active',
  WON = 'won',
  LOST = 'lost',
  REFUNDED = 'refunded'
}

export enum TransactionType {
  INITIAL_POINTS = 'initial_points',
  BET_PLACED = 'bet_placed',
  BET_WON = 'bet_won',
  BET_REFUNDED = 'bet_refunded',
  ADMIN_ADJUSTMENT = 'admin_adjustment'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PlaceBetRequest {
  betId: string;
  optionId: string;
  amount: number;
}

export interface CreateBetRequest {
  title: string;
  description: string;
  categoryId: string;
  options: string[];
}

export interface ResolveBetRequest {
  betId: string;
  winningOptionId: string;
}