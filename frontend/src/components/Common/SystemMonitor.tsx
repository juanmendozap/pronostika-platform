import React, { useState, useEffect } from 'react';

interface SystemHealth {
  status: string;
  timestamp: string;
  uptime?: number;
  database?: string;
  memory?: {
    used: number;
    total: number;
  };
  stats?: {
    users: number;
    bets: number;
  };
}

const SystemMonitor: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [error, setError] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const checkHealth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      setHealth(data);
      setError('');
    } catch (err) {
      setError('Unable to connect to server');
      setHealth(null);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    return status === 'healthy' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    return status === 'healthy' ? '🟢' : '🔴';
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="System Monitor"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">System Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {error ? (
        <div className="text-red-600 text-sm">
          <span className="mr-2">🔴</span>
          {error}
        </div>
      ) : health ? (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={getStatusColor(health.status)}>
              {getStatusIcon(health.status)} {health.status}
            </span>
          </div>

          {health.uptime && (
            <div className="flex justify-between">
              <span>Uptime:</span>
              <span>{formatUptime(health.uptime)}</span>
            </div>
          )}

          {health.database && (
            <div className="flex justify-between">
              <span>Database:</span>
              <span className={health.database === 'connected' ? 'text-green-600' : 'text-red-600'}>
                {health.database === 'connected' ? '🟢' : '🔴'} {health.database}
              </span>
            </div>
          )}

          {health.memory && (
            <div className="flex justify-between">
              <span>Memory:</span>
              <span>{health.memory.used}MB / {health.memory.total}MB</span>
            </div>
          )}

          {health.stats && (
            <>
              <div className="flex justify-between">
                <span>Users:</span>
                <span>{health.stats.users}</span>
              </div>
              <div className="flex justify-between">
                <span>Bets:</span>
                <span>{health.stats.bets}</span>
              </div>
            </>
          )}

          <div className="flex justify-between text-xs text-gray-500">
            <span>Last Check:</span>
            <span>{new Date(health.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-sm">Loading...</div>
      )}

      <button
        onClick={checkHealth}
        className="mt-3 w-full bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
      >
        Refresh
      </button>
    </div>
  );
};

export default SystemMonitor;