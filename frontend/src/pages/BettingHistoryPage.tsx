import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { API_BASE_URL } from '../config/api'

interface BetHistory {
  id: string;
  amount: number;
  potential_winnings: number;
  status: string;
  placed_at: string;
  bet_id: string;
  bet_title: string;
  option_text: string;
}

const BettingHistoryPage: React.FC = () => {
  const { } = useAuth() // Removed unused 'user' variable
  const { t } = useLanguage()
  const [bets, setBets] = useState<BetHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, active, won, lost
  const [stats, setStats] = useState({
    totalBets: 0,
    totalWagered: 0,
    totalWinnings: 0,
    activeBets: 0,
    winRate: 0
  })

  useEffect(() => {
    fetchBettingHistory()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [bets])

  const fetchBettingHistory = async () => {
    try {
      const token = localStorage.getItem('token')
const response = await fetch(`${API_BASE_URL}/api/users/bets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setBets(data.data.bets)
      }
    } catch (error) {
      console.error('Error fetching betting history:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const totalBets = bets.length
    const totalWagered = bets.reduce((sum, bet) => sum + bet.amount, 0)
    const wonBets = bets.filter(bet => bet.status === 'won')
    const totalWinnings = wonBets.reduce((sum, bet) => sum + bet.potential_winnings, 0)
    const activeBets = bets.filter(bet => bet.status === 'active').length
    const winRate = totalBets > 0 ? Math.round((wonBets.length / totalBets) * 100) : 0

    setStats({
      totalBets,
      totalWagered,
      totalWinnings,
      activeBets,
      winRate
    })
  }

  const filteredBets = bets.filter(bet => {
    if (filter === 'all') return true
    return bet.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'bg-green-100 text-green-800'
      case 'lost': return 'bg-red-100 text-red-800'
      case 'active': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won': return '✅'
      case 'lost': return '❌'
      case 'active': return '⏳'
      case 'cancelled': return '⚪'
      default: return '⚪'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📋 Betting History</h1>
        <p className="mt-2 text-gray-600">Track all your betting activity and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">{stats.totalBets}</div>
          <div className="text-sm text-gray-600">Total Bets</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-red-600">{stats.totalWagered.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Wagered</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-green-600">{stats.totalWinnings.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Winnings</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-yellow-600">{stats.activeBets}</div>
          <div className="text-sm text-gray-600">Active Bets</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-purple-600">{stats.winRate}%</div>
          <div className="text-sm text-gray-600">Win Rate</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All Bets', count: bets.length },
            { value: 'active', label: 'Active', count: bets.filter(b => b.status === 'active').length },
            { value: 'won', label: 'Won', count: bets.filter(b => b.status === 'won').length },
            { value: 'lost', label: 'Lost', count: bets.filter(b => b.status === 'lost').length }
          ].map(({ value, label, count }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Betting History Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredBets.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">
              {filter === 'all' 
                ? "You haven't placed any bets yet." 
                : `No ${filter} bets found.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bet Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Your Choice
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Potential/Actual
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBets.map((bet) => (
                  <tr key={bet.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bet.status)}`}>
                        <span className="mr-1">{getStatusIcon(bet.status)}</span>
                        {bet.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {bet.bet_title}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 font-medium">
                        {bet.option_text}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-semibold text-red-600">
                        -{bet.amount}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${
                        bet.status === 'won' ? 'text-green-600' : 
                        bet.status === 'lost' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {bet.status === 'won' ? '+' : ''}
                        {bet.status === 'active' ? `${bet.potential_winnings} (potential)` : 
                         bet.status === 'won' ? bet.potential_winnings :
                         bet.status === 'lost' ? '0' : bet.potential_winnings}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(bet.placed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Net Profit/Loss Summary */}
      {stats.totalBets > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                (stats.totalWinnings - stats.totalWagered) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(stats.totalWinnings - stats.totalWagered) >= 0 ? '+' : ''}
                {(stats.totalWinnings - stats.totalWagered).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Net Profit/Loss</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalWagered > 0 ? Math.round((stats.totalWinnings / stats.totalWagered) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Return on Investment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalBets > 0 ? Math.round(stats.totalWagered / stats.totalBets) : 0}
              </div>
              <div className="text-sm text-gray-600">Avg Bet Size</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BettingHistoryPage