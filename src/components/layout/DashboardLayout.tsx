import React from 'react';
import { LayoutDashboard, Database, Settings, LogOut, Box } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const SIDEBAR_ITEMS = [
  { 
    group: "Overview",
    items: [
      { label: 'Overview', path: '/dashboard', icon: LayoutDashboard }
    ]
  },
  { 
    group: "Content",
    items: [
      { label: 'Schema Builder', path: '/schema-builder', icon: Database },
      { label: 'Content Manager', path: '/content-manager', icon: Box },
    ]
  },
  { 
    group: "Settings",
    items: [
      { label: 'Settings', path: '/settings', icon: Settings }
    ]
  }
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-dark">
      
      {/* Top Header */}
      <header className="h-14 bg-dark text-white flex items-center justify-between px-4 shadow-md z-50 fixed w-full top-0 left-0 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1 rounded">
            <Box size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">CMaaS <span className="text-gray-500 text-xs font-normal">| Admin Console</span></span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-300 hidden sm:inline">Tenant: <span className="text-primary font-semibold">PubuduCorp</span></span>
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white border border-gray-600">PB</div>
        </div>
      </header>

      {/* Main Layout Wrapper */}
      <div className="flex pt-14 h-screen overflow-hidden">
        
        {/* Sidebar - NOW DARK THEME */}
        <aside className="w-64 bg-dark border-r border-gray-800 flex flex-col h-full overflow-y-auto">
          <nav className="p-4 space-y-6">
            
            {SIDEBAR_ITEMS.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.group !== "Overview" && (
                  <div className="mb-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {group.group}
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavItem 
                      key={item.path}
                      to={item.path} 
                      icon={<item.icon size={18} />} 
                      label={item.label} 
                      active={location.pathname === item.path} 
                    />
                  ))}
                </div>
              </div>
            ))}

          </nav>
          
          <div className="mt-auto p-4 border-t border-gray-800">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-red-600/20 rounded-md transition-colors w-full group"
            >
              <LogOut size={18} className="group-hover:text-red-500 transition-colors" /> 
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Helper Component for Nav Items (Updated for Dark Sidebar)
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ icon, label, to, active = false }: NavItemProps) {
  return (
    <Link 
      to={to} 
      className={`
        flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 group
        ${active 
          ? 'bg-primary text-white shadow-sm font-medium' // Active: Orange BG + White Text
          : 'text-gray-400 hover:bg-gray-800 hover:text-white' // Inactive: Gray Text -> White on Hover
        }
      `}
    >
      {/* Icon Color Logic */}
      <span className={active ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}