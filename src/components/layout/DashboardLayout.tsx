import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Database,
  Settings,
  LogOut,
  Box,
  Plus,
  FileText,
  Users,
  Loader2,
  Book,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { getUser, type User } from "../../lib/auth";

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
  icon: React.ElementType;
  hasButton?: boolean;
  buttonLabel?: string;
  dynamic?: boolean;
}

interface SidebarGroup {
  group: string;
  items: SidebarItem[];
}

const STATIC_SIDEBAR_ITEMS: SidebarGroup[] = [
  {
    group: "Overview",
    items: [{ label: "Overview", path: "/app/dashboard", icon: LayoutDashboard }],
  },
  {
    group: "Structure",
    items: [
      {
        label: "Content Types",
        path: "/app/content-types",
        icon: Database,
      },
    ],
  },
  {
    group: "Collections",
    items: [
      {
        label: "Loading...",
        path: "#",
        icon: Box,
        dynamic: true,
      },
    ],
  },
  {
    group: "Settings",
    items: [{ label: "Settings", path: "/app/settings", icon: Settings }],
  },
  {
    group: "Help",
    items: [{ label: "Documentation", path: "/app/documentation", icon: Book }],
  },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  // Refresh trigger to reload sidebar when types change
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Define fetch function
  const fetchContentTypes = async () => {
    try {
      const response = await api.get(`/ContentTypes?t=${Date.now()}`);
      setContentTypes(response.data);
    } catch (error) {
      console.error("Failed to fetch content types:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load User Info
  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUser();
      if (userData) setUser(userData);
    };
    loadUser();
  }, []);

  // Fetch Content Types on refresh or mount
  useEffect(() => {
    fetchContentTypes();
  }, [refreshTrigger]);

  // Trigger refresh on route changes (in case user added a type)
  useEffect(() => {
    if (location.pathname === '/app/dashboard' || location.pathname.startsWith('/app/content-types')) {
      setRefreshTrigger(prev => prev + 1);
    }
  }, [location.pathname]);

  // Trigger refresh on window focus
  useEffect(() => {
    const handleFocus = () => setRefreshTrigger(prev => prev + 1);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("product")) return Box;
    if (lowerName.includes("user") || lowerName.includes("author")) return Users;
    return FileText;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const sortedContentTypes = [...contentTypes].sort((a, b) => {
    const aIsProduct = a.name.toLowerCase().includes("product");
    const bIsProduct = b.name.toLowerCase().includes("product");
    if (aIsProduct && !bIsProduct) return -1;
    if (!aIsProduct && bIsProduct) return 1;
    return a.name.localeCompare(b.name);
  });

  // 1. FIX: Explicitly type the result as SidebarGroup[]
  const processedSidebarItems: SidebarGroup[] = STATIC_SIDEBAR_ITEMS.map((group) => {
    if (group.group === "Collections") {
      let newItems: SidebarItem[] = [];

      if (loading) {
        newItems = [{ label: "Loading...", path: "#", icon: Loader2, dynamic: true }];
      } else if (contentTypes.length === 0) {
        newItems = [{ label: "No collections yet", path: "#", icon: Box, dynamic: true }];
      } else {
        newItems = sortedContentTypes.map((ct) => ({
          label: ct.name,
          path: `/app/content-manager/${ct.id}`, // Route to view entries
          icon: getIcon(ct.name),
          dynamic: true,
          // hasButton is optional, so we don't need to define it here
        }));
      }

      return { ...group, items: newItems };
    }
    return group;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-dark">
      {/* Top Header */}
      <header className="h-14 bg-dark text-white flex items-center justify-between px-4 shadow-md z-50 fixed w-full top-0 left-0 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1 rounded">
            <img src="/logo.png" alt="Logo" className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            SchemaFlow{" "}
            <span className="text-gray-500 text-xs font-normal">
              | Admin Console
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-300 hidden sm:inline">
            <span className="text-primary font-semibold">{user?.tenantName || 'Organization'}</span>
          </span>
          <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold border border-primary" title={user?.fullName}>
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </header>

      {/* Main Layout Wrapper */}
      <div className="flex pt-14 h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-dark border-r border-gray-800 flex flex-col h-full overflow-y-auto">
          <nav className="p-4 space-y-6">
            {processedSidebarItems.map((group, groupIndex) => (
              <div key={group.group || groupIndex}>
                {group.group !== "Overview" && (
                  <div className="mb-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {group.group}
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <div
                      key={item.label + item.path}
                      className="flex items-center justify-between w-full group/item"
                    >
                      {item.path === "#" ? (
                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 flex-1 cursor-default select-none">
                          <span className="text-gray-600">
                            {/* item.icon is dynamically rendered */}
                            {item.icon === Loader2 ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <item.icon size={18} />
                            )}
                          </span>
                          <span>{item.label}</span>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-between">
                          <NavItem
                            to={item.path}
                            icon={<item.icon size={18} />}
                            label={item.label}
                            active={location.pathname === item.path || location.pathname.startsWith(item.path + '/')}
                          />
                          
                          {/* 2. FIX: Safely access hasButton because the type is consistent */}
                          {item.hasButton && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate("/app/content-types"); // Or open modal
                              }}
                              className="opacity-0 group-hover/item:opacity-100 text-gray-500 hover:text-primary transition-all duration-200 p-1 mr-1"
                              title={item.buttonLabel || "+ Create"}
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="mt-auto p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-red-600/20 rounded-md transition-colors w-full group"
            >
              <LogOut
                size={18}
                className="group-hover:text-red-500 transition-colors"
              />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Nav Helper
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
        flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 w-full
        ${
          active
            ? "bg-primary text-white shadow-sm font-medium"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }
      `}
    >
      <span
        className={
          active
            ? "text-white"
            : "text-gray-500 group-hover:text-white transition-colors"
        }
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
}