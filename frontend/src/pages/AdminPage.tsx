import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface Category {
  id: string;
  name: string;
  description: string;
}

interface BetOption {
  text: string;
  odds: number;
}

interface NewBet {
  title: string;
  description: string;
  categoryId: string;
  options: BetOption[];
}

const AdminPage: React.FC = () => {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('create-bet')
  
  // New bet form state
  const [newBet, setNewBet] = useState<NewBet>({
    title: '',
    description: '',
    categoryId: '',
    options: [{ text: '', odds: 1.0 }, { text: '', odds: 1.0 }]
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  const addOption = () => {
    setNewBet(prev => ({
      ...prev,
      options: [...prev.options, { text: '', odds: 1.0 }]
    }))
  }

  const updateOption = (index: number, field: 'text' | 'odds', value: string | number) => {
    setNewBet(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }))
  }

  const removeOption = (index: number) => {
    if (newBet.options.length > 2) {
      setNewBet(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }))
    }
  }

  const createBet = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newBet.title || !newBet.description || !newBet.categoryId) {
      alert('Please fill in all required fields')
      return
    }

    if (newBet.options.some(opt => !opt.text || opt.odds <= 0)) {
      alert('Please fill in all betting options with valid odds')
      return
    }

    setCreating(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBet)
      })

      const data = await response.json()
      if (data.success) {
        alert('Bet created successfully!')
        // Reset form
        setNewBet({
          title: '',
          description: '',
          categoryId: '',
          options: [{ text: '', odds: 1.0 }, { text: '', odds: 1.0 }]
        })
      } else {
        alert(data.error || 'Failed to create bet')
      }
    } catch (error) {
      console.error('Error creating bet:', error)
      alert('Failed to create bet')
    } finally {
      setCreating(false)
    }
  }

  if (!user?.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800">Access Denied</h2>
          <p className="text-red-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="mt-2 text-gray-600">Manage betting categories, create new bets, and monitor platform activity.</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('create-bet')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create-bet'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Create New Bet
          </button>
          <button
            onClick={() => setActiveTab('manage-categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage-categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Categories
          </button>
        </nav>
      </div>

      {/* Create New Bet Tab */}
      {activeTab === 'create-bet' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Create New Betting Market</h2>
          
          <form onSubmit={createBet} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bet Title *
                </label>
                <input
                  type="text"
                  value={newBet.title}
                  onChange={(e) => setNewBet(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Will Bitcoin reach $100,000 in 2024?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={newBet.categoryId}
                  onChange={(e) => setNewBet(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={newBet.description}
                onChange={(e) => setNewBet(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide detailed description of the betting market..."
                required
              />
            </div>

            {/* Betting Options */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Betting Options *
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  Add Option
                </button>
              </div>
              
              <div className="space-y-3">
                {newBet.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOption(index, 'text', e.target.value)}
                        placeholder={`Option ${index + 1} (e.g., "Yes" or "Above $50,000")`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        value={option.odds}
                        onChange={(e) => updateOption(index, 'odds', parseFloat(e.target.value) || 1.0)}
                        step="0.1"
                        min="1.0"
                        placeholder="Odds"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {newBet.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating Bet...' : 'Create Betting Market'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manage Categories Tab */}
      {activeTab === 'manage-categories' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Available Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage