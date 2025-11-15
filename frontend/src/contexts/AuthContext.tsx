import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  username: string
  points: number
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile')
      setUser(response.data.data.user)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { user, token } = response.data.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      
      toast.success('Welcome back!')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/register', { email, username, password })
      const { user, token } = response.data.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      
      toast.success(`Welcome to Pronostika, ${username}! You've received 1000 points to start betting.`)
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}