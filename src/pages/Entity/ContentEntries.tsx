import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import api from '../../lib/axios';

// --- Image Cell Component (Skeleton Loader) ---
const ImageCell = ({ src }: { src: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-10 h-10 group">
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
      )}
      <img
        src={src}
        alt="Thumbnail"
        className={`w-10 h-10 object-cover rounded-md border border-gray-200 shadow-sm transition-opacity duration-300
          ${loading ? 'opacity-0' : 'opacity-100'}
          ${error ? 'hidden' : 'block'}
        `}
        onLoad={() => setLoading(false)}
        onError={() => { setLoading(false); setError(true); }}
      />
      {error && (
        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
          <span className="text-xs">N/A</span>
        </div>
      )}
      {!loading && !error && (
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded-md text-white cursor-pointer"
          title="View Full Image"
        >
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
};

// --- Interfaces ---
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

interface ContentEntry {
  id: number;
  data: { [key: string]: any };
  contentTypeId: number;
  tenantId: number;
  isVisible: boolean; // ✅ Added isVisible
  createdAt: string;
}

interface PaginatedResponse {
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: ContentEntry[];
}

export default function ContentEntries() {
  const { contentTypeId } = useParams<{ contentTypeId: string }>();
  const navigate = useNavigate();

  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());

  const tableColumns = entries.length > 0 
    ? Object.keys(entries[0].data) 
    : contentType?.schema?.fields.map(f => f.name) || [];

  const getFieldType = (fieldName: string) => {
    const field = contentType?.schema?.fields.find(f => f.name === fieldName);
    return field ? field.type : 'text';
  };

  useEffect(() => {
    if (contentTypeId) {
      fetchContentType();
    }
  }, [contentTypeId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentTypeId) {
        fetchEntries(currentPage, searchTerm);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [contentTypeId, currentPage, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const fetchContentType = async () => {
    try {
      const response = await api.get(`/ContentTypes`);
      const foundType = response.data.find((type: any) => type.id === parseInt(contentTypeId!));
      setContentType(foundType || null);
    } catch (error) {
      console.error('Failed to fetch content type:', error);
    }
  };

  const fetchEntries = async (page: number, search: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        Page: page.toString(),
        PageSize: pageSize.toString(),
        ...(search && { SearchTerm: search }),
      });

      const response = await api.get<PaginatedResponse>(`/ContentEntries/${contentTypeId}?${params}`);
      
      setEntries(response.data.data);
      setTotalRecords(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page); 
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ New Toggle Visibility Function
  const handleToggleVisibility = async (entry: ContentEntry) => {
    // Prevent multiple clicks on the same entry
    if (togglingIds.has(entry.id)) return;

    // Add to toggling set
    setTogglingIds(prev => new Set(prev).add(entry.id));

    // 1. Optimistic Update (UI එක ඉක්මනට වෙනස් කරන්න)
    const originalEntries = [...entries];
    const updatedEntries = entries.map((e) => 
      e.id === entry.id ? { ...e, isVisible: !e.isVisible } : e
    );
    setEntries(updatedEntries);

    try {
      // 2. Call Backend
      await api.patch(`/ContentEntries/${entry.id}/toggle-visibility`);
      
      // Wait 2 seconds before re-enabling the button
      setTimeout(() => {
        setTogglingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(entry.id);
          return newSet;
        });
      }, 2000);
      
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      // Revert if failed
      setEntries(originalEntries);
      // Remove from toggling set on error
      setTogglingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(entry.id);
        return newSet;
      });
      alert('Failed to update visibility status');
    }
  };

  const handleEdit = (entryId: number) => {
    navigate(`/content-manager/${contentTypeId}/edit/${entryId}`);
  };

  const handleDelete = async (entryId: number) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      await api.delete(`/ContentEntries/entry/${entryId}`);
      if (entries.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchEntries(currentPage, searchTerm);
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
      alert('Failed to delete entry');
    }
  };

  const getPageNumbers = () => {
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (!contentType && !loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Content type not found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{contentType?.name} Entries</h1>
            <p className="text-sm text-gray-500">{totalRecords} entries found</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/content-manager/${contentTypeId}/create`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Create New Entry
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {tableColumns.map((colName) => (
                  <th key={colName} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {colName}
                  </th>
                ))}
                {/* ✅ Status Header */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={tableColumns.length + 2} className="px-6 py-12 text-center text-gray-500">Loading data...</td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={tableColumns.length + 2} className="px-6 py-12 text-center text-gray-500">
                    <p>No entries found.</p>
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    {tableColumns.map((colName) => (
                      <td 
                        key={`${entry.id}-${colName}`} 
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-[200px]"
                      >
                        {renderCellContent(entry.data[colName], getFieldType(colName))}
                      </td>
                    ))}
                    
                    {/* ✅ Status Column with Toggle Switch */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleVisibility(entry)}
                          disabled={togglingIds.has(entry.id)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                            entry.isVisible ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              entry.isVisible ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-medium w-12 text-center ${entry.isVisible ? 'text-green-700' : 'text-gray-500'}`}>
                          {entry.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(entry.id)} 
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(entry.id)} 
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between mt-4 rounded-b-lg">
          <span className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded text-sm hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            
            {getPageNumbers().map((pageNum) => (
              <button 
                key={pageNum} 
                onClick={() => setCurrentPage(pageNum)} 
                className={`w-8 h-8 flex items-center justify-center rounded text-sm 
                  ${pageNum === currentPage 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-200'
                  }`}
              >
                {pageNum}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded text-sm hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Function for Cell Content
function renderCellContent(value: any, type: string) {
  if (value === null || value === undefined) return '-';

  if (type === 'image') {
    return <ImageCell src={String(value)} />;
  }

  if (type === 'boolean') {
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{value ? 'Yes' : 'No'}</span>;
  }

  if (type === 'date') {
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return String(value);
    }
  }

  if (type === 'number') {
    return Number(value).toLocaleString();
  }

  const stringVal = String(value);
  if (stringVal.length > 50) {
    return (
      <span title={stringVal} className="cursor-help">
        {stringVal.substring(0, 50)}...
      </span>
    );
  }

  return stringVal;
}