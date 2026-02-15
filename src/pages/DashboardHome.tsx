import { Database, FileText, Activity, Plus, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../lib/axios';

interface RecentEntry {
  id: number;
  typeName: string;
  createdAt: string;
}

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContentTypes: 0,
    totalEntries: 0,
    totalApiKeys: 0,
    recentEntries: [] as RecentEntry[]
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats from the new endpoint
      const response = await api.get('/Dashboard/stats');
      
      setStats({
        totalContentTypes: response.data.totalContentTypes || 0,
        totalEntries: response.data.totalEntries || 0,
        totalApiKeys: response.data.totalApiKeys || 0,
        recentEntries: response.data.recentEntries || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stats configuration for display
  const statsConfig = [
    { label: "Total Content Types", value: stats.totalContentTypes.toString(), icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Entries", value: stats.totalEntries.toString(), icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "API Keys", value: stats.totalApiKeys.toString(), icon: Activity, color: "text-green-600", bg: "bg-green-50" }
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    if (date.getFullYear() === 1) return 'Just now'; // Handle default date 0001-01-01
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-dark">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Pubudu. Here is what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/app/schema-builder" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-dark hover:bg-gray-50 transition-colors shadow-sm">
            <Plus size={16} /> New Schema
          </Link>
        </div>
      </div>

      {/* 2. Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsConfig.map((stat, index) => (
            <div key={index} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <h3 className="text-2xl font-bold text-dark mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Recent Activity Feed */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-dark text-sm flex items-center gap-2">
              <Clock size={16} className="text-gray-400" /> Recent Activity
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentEntries.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No recent activity yet. Create your first content entry to get started.
              </div>
            ) : (
              stats.recentEntries.map((entry) => (
                <div key={entry.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium text-dark">
                        Created Entry: <span className="font-bold">{entry.typeName}</span>
                      </p>
                      <p className="text-xs text-gray-500">Entry #{entry.id}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium group-hover:text-dark transition-colors">
                    {formatTimeAgo(entry.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
      </div>
    </div>
  );
}