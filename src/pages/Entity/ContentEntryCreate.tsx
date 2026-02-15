import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Type, Hash } from 'lucide-react';
import api from '../../lib/axios';
import ImageUpload from '../../components/ImageUpload';

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

export default function ContentEntryCreate() {
  const { contentTypeId } = useParams(); 
  const navigate = useNavigate();
  
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contentTypeId) fetchContentType();
  }, [contentTypeId]);

  const fetchContentType = async () => {
    try {
      const response = await api.get(`/ContentTypes/${contentTypeId}`);
      setContentType(response.data);

      // Initialize defaults for new entry
      const initialData: Record<string, any> = {};
      response.data.schema?.fields?.forEach((field: any) => {
        if (field.type === 'boolean') initialData[field.name] = false;
        else if (field.type === 'array') initialData[field.name] = [];
        else initialData[field.name] = '';
      });
      setFormData(initialData);
      
    } catch (error) {
      console.error('Failed to fetch content type:', error);
      alert("Error loading schema");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        contentTypeId: Number(contentTypeId),
        data: formData, 
      };

      await api.post('/ContentEntries', payload);
      navigate(`/content-manager/${contentTypeId}`);
      
    } catch (error) {
      console.error('Failed to create entry:', error);
      alert('Failed to create entry. Check console.');
    } finally {
      setSaving(false);
    }
  };

  // Render Helper
  const renderField = (field: { name: string; type: string }) => {
    const value = formData[field.name] ?? ''; 

    switch (field.type) {
      case 'string':
        return (
          <div className="relative">
             <Type className="absolute left-3 top-2.5 text-gray-400" size={16} />
             <input type="text" value={value} onChange={(e) => handleInputChange(field.name, e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter text..." />
          </div>
        );
      case 'number':
        return (
          <div className="relative">
            <Hash className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input type="number" value={value} onChange={(e) => handleInputChange(field.name, Number(e.target.value))} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" placeholder="0" />
          </div>
        );
      case 'datetime':
        return <input type="datetime-local" value={value} onChange={(e) => handleInputChange(field.name, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />;
      case 'boolean':
        return (
          <label className="flex items-center cursor-pointer select-none">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={Boolean(value)} onChange={(e) => handleInputChange(field.name, e.target.checked)} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${value ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <div className="ml-3 text-sm font-medium text-gray-700">{value ? 'Yes' : 'No'}</div>
          </label>
        );
      case 'richtext':
        return <textarea value={value} onChange={(e) => handleInputChange(field.name, e.target.value)} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm" />;
      case 'array':
        return <input type="text" value={Array.isArray(value) ? value.join(', ') : value} onChange={(e) => handleInputChange(field.name, e.target.value.split(',').map((s: string) => s.trim()))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Comma separated values" />;
      case 'image':
        return (
          <ImageUpload
            value={value}
            onChange={(url) => handleInputChange(field.name, url)}
            onDelete={() => handleInputChange(field.name, '')}
            folder={`cmaas/${contentType?.name.toLowerCase()}`}
          />
        );
      default:
        return <input type="text" value={value} onChange={(e) => handleInputChange(field.name, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />;
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Schema...</div>;
  if (!contentType) return <div className="p-10 text-center text-red-500">Content Type Not Found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-dark">New {contentType.name}</h1>
          <p className="text-sm text-gray-500">Create a new entry</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6">
        {contentType.schema.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-bold text-dark mb-2 capitalize items-center gap-2">
              {field.name} <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold border bg-gray-50 text-gray-500 border-gray-100">{field.type}</span>
            </label>
            {renderField(field)}
          </div>
        ))}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
          <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 shadow-sm font-bold">
            <Save size={18} /> {saving ? 'Creating...' : 'Create Entry'}
          </button>
        </div>
      </form>
    </div>
  );
}