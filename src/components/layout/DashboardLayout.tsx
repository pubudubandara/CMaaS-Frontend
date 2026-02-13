import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Database, Settings, LogOut, Box, Plus, FileText, Users } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

interface ContentType {
  id: number;
  name: string;
  schema: {
    fields: Array<{
      name: string;
      type: string;
    }>;
  };
}

interface SidebarItem {
  label: string;
  path: string;
  icon: any;
  hasButton?: boolean;
  buttonLabel?: string;
  dynamic?: boolean; // For dynamic items like collections
}

interface SidebarGroup {
  group: string;
  items: SidebarItem[];
}

const STATIC_SIDEBAR_ITEMS: SidebarGroup[] = [
  { 
    group: "Overview",
    items: [
      { label: 'Overview', path: '/dashboard', icon: LayoutDashboard }
    ]
  },
  { 
    group: "Structure",
    items: [
      { label: 'Content Types', path: '/content-types', icon: Database, hasButton: true, buttonLabel: '+ Create' }
    ]
  },
  { 
    group: "Collections",
    items: [
      { label: 'Products', path: '/content-manager/products', icon: Box, dynamic: true },
      { label: 'Users', path: '/content-manager/users', icon: Users, dynamic: true },
      { label: 'Posts', path: '/content-manager/posts', icon: FileText, dynamic: true }
      // Dynamic items will be replaced/merged with actual content types
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
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentTypes();
  }, []);

  const fetchContentTypes = async () => {
    try {
      const response = await api.get('/ContentTypes');
      setContentTypes(response.data);
    } catch (error) {
      console.error('Failed to fetch content types:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('product')) return Box;
    if (lowerName.includes('user') || lowerName.includes('author')) return Users;
    return FileText;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Sort content types: products first, then others, then settings-related at the bottom
  const sortedContentTypes = [...contentTypes].sort((a, b) => {
    const aIsProduct = a.name.toLowerCase().includes('product');
    const bIsProduct = b.name.toLowerCase().includes('product');
    
    if (aIsProduct && !bIsProduct) return -1;
    if (!aIsProduct && bIsProduct) return 1;
    
    const aIsSettings = a.name.toLowerCase().includes('settings') || a.name.toLowerCase().includes('content');
    const bIsSettings = b.name.toLowerCase().includes('settings') || b.name.toLowerCase().includes('content');
    
    if (aIsSettings && !bIsSettings) return 1;
    if (!aIsSettings && bIsSettings) return -1;
    
    return a.name.localeCompare(b.name);
  });

  // Process sidebar items to replace dynamic collections with actual content types
  const processedSidebarItems = STATIC_SIDEBAR_ITEMS.map(group => {
    if (group.group === "Collections") {
      // Replace the Collections group items with actual content types
      return {
        ...group,
        items: loading 
          ? [{ label: 'Loading...', path: '#', icon: FileText, dynamic: true }]
          : contentTypes.length === 0
          ? [{ label: 'No collections yet', path: '#', icon: FileText, dynamic: true }]
          : sortedContentTypes.map(ct => ({
              label: ct.name,
              path: `/content-manager/${ct.id}`,
              icon: getIcon(ct.name),
              dynamic: true
            }))
      };
    }
    return group;
  });

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
        
        {/* Sidebar - DARK THEME */}
        <aside className="w-64 bg-dark border-r border-gray-800 flex flex-col h-full overflow-y-auto">
          <nav className="p-4 space-y-6">
            
            {/* Processed Sidebar Items */}
            {processedSidebarItems.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.group !== "Overview" && (
                  <div className="mb-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {group.group}
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <div key={item.path} className="flex items-center justify-between w-full group/item">
                      {item.path === '#' ? (
                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 flex-1">
                          <span className="text-gray-600">
                            {item.icon && <item.icon size={18} />}
                          </span>
                          <span>{item.label}</span>
                        </div>
                      ) : (
                        <>
                          <NavItem 
                            to={item.path} 
                            icon={<item.icon size={18} />} 
                            label={item.label} 
                            active={location.pathname === item.path} 
                          />
                          {item.hasButton && (
                            <button
                              onClick={() => navigate('/content-types/create')}
                              className="opacity-0 group-hover/item:opacity-100 text-gray-500 hover:text-primary transition-all duration-200 p-1 -ml-1"
                              title={item.buttonLabel || '+ Create'}
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </nav>
          
          {/* Sign Out Button */}
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
        flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 flex-1
        ${active 
          ? 'bg-primary text-white shadow-sm font-medium'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }
      `}
    >
      <span className={active ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}