import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/axios';

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
  data: { [key: string]: any }; // The dynamic data object
  contentTypeId: number;
  tenantId: number;
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

  // --- 1. Dynamic Column Logic (THE FIX) ---
  // If we have data, use the keys from the first item as headers.
  // If no data, fallback to the schema definition.
  const tableColumns = entries.length > 0 
    ? Object.keys(entries[0].data) 
    : contentType?.schema?.fields.map(f => f.name) || [];

  // Helper to get the field type from the schema (to preserve date/boolean formatting)
  const getFieldType = (fieldName: string) => {
    const field = contentType?.schema?.fields.find(f => f.name === fieldName);
    return field ? field.type : 'text'; // Default to text if schema doesn't match data
  };
  // ------------------------------------------

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
      // Find the specific content type from the list
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
          <button onClick={() => navigate('/content-manager')} className="p-2 hover:bg-gray-100 rounded-lg">
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
                {/* Dynamically Render Headers based on Data Keys */}
                {tableColumns.map((colName) => (
                  <th key={colName} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {colName}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={tableColumns.length + 1} className="px-6 py-12 text-center text-gray-500">Loading data...</td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={tableColumns.length + 1} className="px-6 py-12 text-center text-gray-500">
                    <p>No entries found.</p>
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    {/* Dynamically Render Cells */}
                    {tableColumns.map((colName) => (
                      <td key={`${entry.id}-${colName}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                         {/* We pass the column name to getFieldType to see if it needs special formatting */}
                        {renderCellContent(entry.data[colName], getFieldType(colName))}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(entry.id)} 
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit entry"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(entry.id)} 
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete entry"
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
              className="w-8 h-8 flex items-center justify-center rounded text-sm hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
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
              className="w-8 h-8 flex items-center justify-center rounded text-sm hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function renderCellContent(value: any, type: string) {
  if (value === null || value === undefined) return '-';
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
  return String(value);
}