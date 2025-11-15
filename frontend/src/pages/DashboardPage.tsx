import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface BetOption {
  id: string;
  text: string;
  odds: number;
  total_staked: number;
}

interface Bet {
  id: string;
  title: string;
  description: string;
  total_pool: number;
  status: string;
  created_at: string;
  category_name: string;
  options: BetOption[];
}

interface UserBet {
  id: string;
  bet_title: string;
  option_text: string;
  amount: number;
  potential_winnings: number;
  status: string;
  placed_at: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth()

  // Helper functions for category styling
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Sports': 'border-green-500',
      'Politics': 'border-blue-500',
      'Technology': 'border-purple-500',
      'Cryptocurrency': 'border-yellow-500',
      'Entertainment': 'border-pink-500',
      'Weather': 'border-cyan-500',
      'Social Media': 'border-orange-500'
    }
    return colors[category] || 'border-gray-500'
  }

  const getCategoryBadge = (category: string) => {
    const badges: Record<string, string> = {
      'Sports': 'bg-green-100 text-green-800',
      'Politics': 'bg-blue-100 text-blue-800',
      'Technology': 'bg-purple-100 text-purple-800',
      'Cryptocurrency': 'bg-yellow-100 text-yellow-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Weather': 'bg-cyan-100 text-cyan-800',
      'Social Media': 'bg-orange-100 text-orange-800'
    }
    return badges[category] || 'bg-gray-100 text-gray-800'
  }
  const [bets, setBets] = useState<Bet[]>([])
  const [userBets, setUserBets] = useState<UserBet[]>([])
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all') // all, open, closed
  const [viewMode, setViewMode] = useState<string>('category') // category, list
  const [selectedBet, setSelectedBet] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [betAmount, setBetAmount] = useState<number>(10)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    fetchBets()
    fetchUserBets()
    fetchCategories()
  }, [])

  // Refetch when filters change
  useEffect(() => {
    if (!loading) {
      fetchBets()
    }
  }, [selectedCategory, selectedStatus])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setCategories(data.data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchBets = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/bets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setBets(data.data.bets)
      }
    } catch (error) {
      console.error('Error fetching bets:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserBets = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/users/bets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setUserBets(data.data.bets)
      }
    } catch (error) {
      console.error('Error fetching user bets:', error)
    }
  }

  const placeBet = async () => {
    if (!selectedBet || !selectedOption || betAmount <= 0) return

    setPlacing(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/bets/${selectedBet}/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          optionId: selectedOption,
          amount: betAmount
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('Bet placed successfully!')
        // Refresh data
        fetchBets()
        fetchUserBets()
        // Reset form
        setSelectedBet(null)
        setSelectedOption(null)
        setBetAmount(10)
        // Update user points in context if needed
        window.location.reload() // Simple way to refresh user data
      } else {
        alert(data.error || 'Failed to place bet')
      }
    } catch (error) {
      console.error('Error placing bet:', error)
      alert('Failed to place bet')
    } finally {
      setPlacing(false)
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.username}!</p>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-lg font-semibold text-blue-900">
            Available Points: <span className="text-2xl">{user?.points?.toLocaleString()}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Bets */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-2xl font-bold">Available Bets</h2>
              
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <button
                  onClick={() => setViewMode('category')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    viewMode === 'category' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  📂 By Topic
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  📄 List View
                </button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name.toLowerCase()}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="open">🟢 Open Bets</option>
                <option value="closed">🔴 Closed Bets</option>
              </select>
            </div>
          </div>
          {(() => {
            let filteredBets = bets;
            
            // Filter by category
            if (selectedCategory !== 'all') {
              filteredBets = filteredBets.filter(bet => bet.category_name.toLowerCase() === selectedCategory);
            }
            
            // Filter by status
            if (selectedStatus !== 'all') {
              if (selectedStatus === 'open') {
                filteredBets = filteredBets.filter(bet => bet.status === 'active');
              } else if (selectedStatus === 'closed') {
                filteredBets = filteredBets.filter(bet => bet.status !== 'active');
              }
            }
            
            if (filteredBets.length === 0) {
              return (
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-500">
                    No bets found matching your filters.
                  </p>
                </div>
              );
            }
            
            // Group by category for category view
            if (viewMode === 'category') {
              const betsByCategory: Record<string, typeof filteredBets> = {};
              filteredBets.forEach(bet => {
                if (!betsByCategory[bet.category_name]) {
                  betsByCategory[bet.category_name] = [];
                }
                betsByCategory[bet.category_name].push(bet);
              });
              
              return (
                <div className="space-y-8">
                  {Object.entries(betsByCategory).map(([categoryName, categoryBets]) => (
                    <div key={categoryName} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-semibold text-gray-900">{categoryName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(categoryName)}`}>
                          {categoryBets.length} bet{categoryBets.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {categoryBets.map((bet) => (
                          <div key={bet.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${getCategoryColor(bet.category_name)}`}>
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">{bet.title}</h4>
                                <p className="text-gray-600 text-sm mt-1">{bet.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <span>Pool: {bet.total_pool} points</span>
                                  <span className={`px-2 py-1 rounded-full ${
                                    bet.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {bet.status === 'active' ? '🟢 Open' : '🔴 Closed'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {bet.status === 'active' && (
                              <div className="space-y-2">
                                {bet.options.map((option) => (
                                  <div key={option.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                                    <label className="flex items-center cursor-pointer flex-1">
                                      <input
                                        type="radio"
                                        name={`bet-${bet.id}`}
                                        value={option.id}
                                        checked={selectedBet === bet.id && selectedOption === option.id}
                                        onChange={() => {
                                          setSelectedBet(bet.id)
                                          setSelectedOption(option.id)
                                        }}
                                        className="mr-2"
                                      />
                                      <span className="text-sm font-medium">{option.text}</span>
                                    </label>
                                    <div className="text-right text-xs">
                                      <div className="font-bold text-green-600">{option.odds.toFixed(2)}x</div>
                                      <div className="text-gray-500">{option.total_staked} pts</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
            
            // List view
            return (
              <div className="space-y-4">
                {filteredBets.map((bet) => (
                  <div key={bet.id} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getCategoryColor(bet.category_name)}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{bet.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(bet.category_name)}`}>
                          {bet.category_name}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{bet.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Total Pool: {bet.total_pool} points
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      bet.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {bet.status.toUpperCase()}
                    </span>
                  </div>

                  {bet.status === 'active' && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Betting Options:</h4>
                      {bet.options.map((option) => (
                        <div key={option.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex-1">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name={`bet-${bet.id}`}
                                value={option.id}
                                checked={selectedBet === bet.id && selectedOption === option.id}
                                onChange={() => {
                                  setSelectedBet(bet.id)
                                  setSelectedOption(option.id)
                                }}
                                className="mr-3"
                              />
                              <span className="font-medium">{option.text}</span>
                            </label>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-bold text-green-600">
                              {option.odds.toFixed(2)}x odds
                            </div>
                            <div className="text-gray-500">
                              {option.total_staked} points staked
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Betting Panel & User Bets */}
        <div className="space-y-8">
          {/* Place Bet Panel */}
          {selectedBet && selectedOption && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Place Your Bet</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bet Amount (Points)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={user?.points || 0}
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  Potential winnings: <span className="font-bold text-green-600">
                    {Math.floor(betAmount * (bets.find(b => b.id === selectedBet)?.options.find(o => o.id === selectedOption)?.odds || 1))} points
                  </span>
                </div>
                <button
                  onClick={placeBet}
                  disabled={placing || betAmount <= 0 || betAmount > (user?.points || 0)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {placing ? 'Placing Bet...' : 'Place Bet'}
                </button>
              </div>
            </div>
          )}

          {/* User's Bets */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Your Bets</h3>
            {userBets.length === 0 ? (
              <p className="text-gray-500">You haven't placed any bets yet.</p>
            ) : (
              <div className="space-y-3">
                {userBets.slice(0, 5).map((userBet) => (
                  <div key={userBet.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="font-medium text-sm">{userBet.bet_title}</div>
                    <div className="text-sm text-gray-600">{userBet.option_text}</div>
                    <div className="text-xs text-gray-500">
                      {userBet.amount} points → {userBet.potential_winnings} potential
                    </div>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      userBet.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                      userBet.status === 'won' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {userBet.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage