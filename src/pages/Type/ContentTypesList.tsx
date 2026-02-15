import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, FileText, Box, Users } from 'lucide-react';
import api from '../../lib/axios';

interface ContentType {
  id: number;
  name: string;
  // Made optional to prevent crashes
  schema?: {
    fields?: Array<{
      name: string;
      type: string;
    }>;
  };
}

export default function ContentTypesList() {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this content type?')) {
      try {
        await api.delete(`/ContentTypes/${id}`);
        fetchContentTypes(); // Refresh list
      } catch (error) {
        console.error('Failed to delete content type:', error);
        alert('Failed to delete content type');
      }
    }
  };

  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('product')) return Box;
    if (lowerName.includes('user') || lowerName.includes('author')) return Users;
    return FileText;
  };

  // Helper to get badge color based on type
  const getFieldColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'string': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'number': return 'bg-green-100 text-green-700 border-green-200';
      case 'boolean': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'date': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 animate-pulse">Loading content types...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">Content Types</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the structure of your content.</p>
        </div>
        <button
          onClick={() => navigate('/schema-builder')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
          Create New Type
        </button>
      </div>

      {contentTypes.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
             <FileText size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-dark mb-1">No content types found</h3>
          <p className="text-gray-500 mb-6">Create your first schema to start adding content.</p>
          <button
            onClick={() => navigate('/schema-builder')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            <Plus size={18} />
            Create Content Type
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentTypes.map((type) => {
            const IconComponent = getIcon(type.name);
            // CRITICAL FIX: Safe access with fallback to empty array
            const fields = type.schema?.fields || [];

            return (
              <div key={type.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow group flex flex-col h-full">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary-light/50 rounded-lg text-primary">
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark text-lg leading-tight">{type.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{fields.length} fields configured</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/content-manager/${type.id}`)}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-light rounded transition-colors"
                      title="View Entries"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/content-types/edit/${type.id}`)} 
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Schema"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Type"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Fields List */}
                <div className="space-y-2 mb-4 flex-1">
                  {fields.length > 0 ? (
                    fields.slice(0, 3).map((field, index) => (
                      <div key={index} className="flex justify-between items-center text-sm py-1 border-b border-gray-50 last:border-0">
                        <span className="text-gray-600 font-medium">{field.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getFieldColor(field.type)}`}>
                          {field.type}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400 italic py-2">No fields defined yet.</div>
                  )}
                </div>

                {/* Footer / More fields indicator */}
                {fields.length > 3 && (
                  <div className="pt-3 border-t border-gray-100 text-xs text-center text-gray-400 font-medium">
                    +{fields.length - 3} more fields
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}