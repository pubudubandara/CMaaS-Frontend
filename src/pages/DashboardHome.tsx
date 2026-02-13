import { Database, FileText, Activity, Server, Plus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
  // Mock Data - Replace with API calls later
  const stats = [
    { label: "Total Content Types", value: "12", icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Entries", value: "1,248", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "API Requests (24h)", value: "45.2k", icon: Activity, color: "text-green-600", bg: "bg-green-50" },
    { label: "Storage Used", value: "2.4 GB", icon: Server, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const recentActivity = [
    { action: "Created Entry", type: "Blog Post", title: "Top 10 React Tips", time: "2 mins ago", user: "Pubudu" },
    { action: "Updated Schema", type: "Product", title: "Added 'Price' field", time: "1 hour ago", user: "Admin" },
    { action: "Deleted Entry", type: "Comment", title: "Spam User #22", time: "3 hours ago", user: "Pubudu" },
    { action: "Published", type: "Case Study", title: "Migration to .NET 8", time: "5 hours ago", user: "Editor" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-dark">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Pubudu. Here is what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/schema-builder" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-dark hover:bg-gray-50 transition-colors shadow-sm">
            <Plus size={16} /> New Schema
          </Link>
          <Link to="/content-manager" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm">
            <Plus size={16} /> Add Content
          </Link>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. Recent Activity Feed (Takes up 2/3 space) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-dark text-sm flex items-center gap-2">
              <Clock size={16} className="text-gray-400" /> Recent Activity
            </h3>
            <button className="text-xs text-primary hover:underline font-medium">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((item, i) => (
              <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium text-dark">
                      {item.action}: <span className="font-bold">{item.type}</span>
                    </p>
                    <p className="text-xs text-gray-500">{item.title} • by {item.user}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium group-hover:text-dark transition-colors">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Quick API Usage / Project Health (Takes up 1/3 space) */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-5">
          <h3 className="font-bold text-dark text-sm">System Health</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">API Usage Limit</span>
                <span className="font-bold text-dark">75%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-3/4 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Storage Limit (5GB)</span>
                <span className="font-bold text-dark">45%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[45%] rounded-full" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-200">
               <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
               <div className="flex-1">
                 <p className="text-xs font-bold text-dark">All Systems Operational</p>
                 <p className="text-[10px] text-gray-500">Last checked: 1 min ago</p>
               </div>
            </div>
          </div>

          <Link to="/settings" className="block text-center text-xs text-gray-500 hover:text-primary mt-2">
            Manage Limits & Billing →
          </Link>
        </div>

      </div>
    </div>
  );
}