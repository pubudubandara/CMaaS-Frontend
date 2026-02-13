import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, FileText, Box, Users } from 'lucide-react';
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
  tenantId: number;
  tenant: any;
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

  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('product')) return Box;
    if (lowerName.includes('user') || lowerName.includes('author')) return Users;
    return FileText;
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this content type?')) {
      try {
        await api.delete(`/ContentTypes/${id}`);
        fetchContentTypes();
      } catch (error) {
        console.error('Failed to delete content type:', error);
        alert('Failed to delete content type');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading content types...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-dark">Content Types</h1>
        <button
          onClick={() => navigate('/content-types/create')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          <Plus size={20} />
          Create New Content Type
        </button>
      </div>

      {contentTypes.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content types yet</h3>
          <p className="text-gray-500 mb-4">Create your first content type to get started</p>
          <button
            onClick={() => navigate('/content-types/create')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Plus size={20} />
            Create Content Type
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentTypes.map((type) => {
            const IconComponent = getIcon(type.name);
            return (
              <div key={type.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-light rounded-lg">
                      <IconComponent size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark">{type.name}</h3>
                      <p className="text-sm text-gray-500">{type.schema.fields.length} fields</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/content-manager/${type.id}`)}
                      className="p-1 text-gray-400 hover:text-primary transition-colors"
                      title="View Entries"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/content-types/${type.id}/edit`)}
                      className="p-1 text-gray-400 hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {type.schema.fields.slice(0, 3).map((field, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{field.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        field.type === 'string' ? 'bg-blue-100 text-blue-700' :
                        field.type === 'number' ? 'bg-green-100 text-green-700' :
                        field.type === 'boolean' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {field.type}
                      </span>
                    </div>
                  ))}
                  {type.schema.fields.length > 3 && (
                    <p className="text-xs text-gray-500">+{type.schema.fields.length - 3} more fields</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}