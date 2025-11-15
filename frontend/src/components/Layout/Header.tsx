import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import LanguageSwitcher from '../Common/LanguageSwitcher'

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()

  const navItems = [
    { name: t('nav.dashboard'), path: '/dashboard', icon: '🏠' },
    { name: 'All Bets', path: '/bets', icon: '🎯' },
    { name: t('nav.leaderboard'), path: '/leaderboard', icon: '🏆' },
    { name: t('nav.history'), path: '/history', icon: '📋' },
    ...(user?.isAdmin ? [{ name: t('nav.admin'), path: '/admin', icon: '⚙️' }] : []),
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">🎲 Pronostika</h1>
            </Link>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
              <span className="text-lg">💰</span>
              <span className="text-sm font-semibold text-green-700">
                {user?.points?.toLocaleString()} {t('common.points')}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-900 hidden sm:block">
                {user?.username}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              {t('nav.logout')}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 pt-2 pb-3">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header