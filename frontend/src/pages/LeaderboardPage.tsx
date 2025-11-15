import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface LeaderboardEntry {
  id: string;
  username: string;
  points: number;
  total_bets: number;
  total_wagered: number;
  total_winnings: number;
  active_bets: number;
  win_rate: number;
  rank: number;
}

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/users/leaderboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setLeaderboard(data.data.leaderboard)
        
        // Find current user's rank
        const userEntry = data.data.leaderboard.find((entry: LeaderboardEntry) => entry.id === user?.id)
        if (userEntry) {
          setCurrentUserRank(userEntry)
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getRankClass = (rank: number, isCurrentUser: boolean) => {
    let baseClass = 'px-4 py-3 '
    
    if (isCurrentUser) {
      baseClass += 'bg-blue-50 border-l-4 border-blue-500 '
    }
    
    switch (rank) {
      case 1: return baseClass + 'bg-gradient-to-r from-yellow-50 to-yellow-100'
      case 2: return baseClass + 'bg-gradient-to-r from-gray-50 to-gray-100'
      case 3: return baseClass + 'bg-gradient-to-r from-orange-50 to-orange-100'
      default: return baseClass + (isCurrentUser ? '' : 'hover:bg-gray-50')
    }
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
        <h1 className="text-3xl font-bold text-gray-900">🏆 Leaderboard</h1>
        <p className="mt-2 text-gray-600">See how you rank against other players</p>
      </div>

      {/* Current User Rank Card */}
      {currentUserRank && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold mb-4">Your Ranking</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getRankIcon(currentUserRank.rank)}
              </div>
              <div className="text-sm text-gray-600">Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentUserRank.points.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {currentUserRank.win_rate}%
              </div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {currentUserRank.total_bets}
              </div>
              <div className="text-sm text-gray-600">Total Bets</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Top Players</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Bets
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Wagered
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Bets
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard.map((entry) => (
                <tr 
                  key={entry.id} 
                  className={getRankClass(entry.rank, entry.id === user?.id)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg font-semibold">
                        {getRankIcon(entry.rank)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {entry.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.username}
                          {entry.id === user?.id && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {entry.points.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className={`font-medium ${
                        entry.win_rate >= 60 ? 'text-green-600' :
                        entry.win_rate >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {entry.win_rate}%
                      </span>
                      <div className="text-xs text-gray-500">
                        {entry.total_bets > 0 ? `${entry.total_bets} bets` : 'No bets'}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {entry.total_bets}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {entry.total_wagered.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {entry.active_bets}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {leaderboard.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No players found in the leaderboard.</p>
        </div>
      )}
    </div>
  )
}

export default LeaderboardPage