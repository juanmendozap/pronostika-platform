import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Header from './components/Layout/Header'
import LoadingSpinner from './components/Common/LoadingSpinner'
import SystemMonitor from './components/Common/SystemMonitor'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import BetsPage from './pages/BetsPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import LeaderboardPage from './pages/LeaderboardPage'
import BettingHistoryPage from './pages/BettingHistoryPage'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <LanguageProvider>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </LanguageProvider>
    )
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        {user && <Header />}
        
        <main className={user ? 'pt-16' : ''}>
          <Routes>
            {!user ? (
              <>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/bets" element={<BetsPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/history" element={<BettingHistoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                {user.isAdmin && (
                  <Route path="/admin" element={<AdminPage />} />
                )}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            )}
          </Routes>
        </main>
        <SystemMonitor />
      </div>
    </LanguageProvider>
  )
}

export default App