import { useState } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash2, 
  ChevronLeft, ChevronRight, FileText, Box, Users 
} from 'lucide-react';

// Mock Data: Existing Content Types
const CONTENT_TYPES = [
  { id: 'blog-post', name: 'Blog Posts', icon: FileText, count: 12 },
  { id: 'product', name: 'Products', icon: Box, count: 45 },
  { id: 'author', name: 'Authors', icon: Users, count: 3 },
];

// Mock Data: Entries for "Blog Post"
const MOCK_ENTRIES = [
  { id: 1, title: 'Getting Started with CMaaS', status: 'Published', author: 'Pubudu', date: '2025-10-24' },
  { id: 2, title: 'Why .NET 8 is the Future', status: 'Draft', author: 'Admin', date: '2025-10-25' },
  { id: 3, title: 'React vs Angular in 2026', status: 'Published', author: 'Editor', date: '2025-10-26' },
  { id: 4, title: '10 Tips for Headless CMS', status: 'Archived', author: 'Pubudu', date: '2025-10-28' },
];

export default function ContentManager() {
  const [selectedType, setSelectedType] = useState('blog-post');
  const [searchTerm, setSearchTerm] = useState('');

  // Find active type name
  const activeType = CONTENT_TYPES.find(t => t.id === selectedType);

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6">
      
      {/* 1. Left Sidebar: Content Type Selector */}
      <div className="w-64 flex-shrink-0 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Collections</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {CONTENT_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                selectedType === type.id 
                  ? 'bg-primary-light text-primary font-medium' 
                  : 'text-dark hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <type.icon size={16} />
                <span>{type.name}</span>
              </div>
              <span className="text-xs bg-white border border-gray-200 px-1.5 rounded-full text-gray-500">
                {type.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Content Area: Data Table */}
      <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h1 className="text-lg font-bold text-dark flex items-center gap-2">
            {activeType?.name} 
            <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Viewing all</span>
          </h1>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search entries..." 
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-primary rounded hover:bg-orange-600 transition-colors shadow-sm">
              <Plus size={16} /> Create New
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase border-b border-gray-200 w-10">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                </th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">Title</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase border-b border-gray-200 w-32">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase border-b border-gray-200 w-40">Author</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase border-b border-gray-200 w-32">Last Updated</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase border-b border-gray-200 w-16 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_ENTRIES.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-3 px-4">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-dark">{entry.title}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={entry.status} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        {entry.author.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600">{entry.author}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-500">{entry.date}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-gray-400 hover:text-primary transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">Showing 1-4 of 12 entries</span>
          <div className="flex gap-1">
            <button className="p-1 rounded hover:bg-gray-200 disabled:opacity-50" disabled>
              <ChevronLeft size={16} className="text-gray-500" />
            </button>
            <button className="p-1 rounded hover:bg-gray-200">
              <ChevronRight size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper: Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Published: "bg-green-100 text-green-700 border-green-200",
    Draft: "bg-gray-100 text-gray-700 border-gray-200",
    Archived: "bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[status] || styles.Draft}`}>
      {status}
    </span>
  );
}