import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Save, ArrowLeft, Type, Calendar, Hash, ToggleLeft, List, FileText, Image } from 'lucide-react';
import api from '../../lib/axios'; // Ensure this points to your real axios instance

interface Field {
  name: string;
  type: string;
}

// These match your Backend C# DTOs
const FIELD_TYPES = [
  { value: 'string', label: 'Text (String)', icon: Type, description: 'Short text (headlines, names)' },
  { value: 'richtext', label: 'Rich Text', icon: FileText, description: 'Long content with formatting' },
  { value: 'number', label: 'Number', icon: Hash, description: 'Integers or decimals' },
  { value: 'datetime', label: 'Date & Time', icon: Calendar, description: 'Timestamps' },
  { value: 'boolean', label: 'Boolean', icon: ToggleLeft, description: 'True/False switches' },
  { value: 'array', label: 'Array / Tags', icon: List, description: 'List of values' },
  { value: 'image', label: 'Image Upload', icon: Image, description: 'Upload images to Cloudinary' },
];

export default function SchemaBuilder() {
  const [name, setName] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addField = (fieldType: string) => {
    const newField: Field = { name: '', type: fieldType };
    setFields([...fields, newField]);
    setShowFieldModal(false);
  };

  const updateField = (index: number, newName: string) => {
    const updatedFields = [...fields];
    updatedFields[index].name = newName;
    setFields(updatedFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation
    if (!name.trim()) return alert('Please provide a Content Type Name');
    if (fields.length === 0) return alert('Please add at least one field');
    if (fields.some(field => !field.name.trim())) return alert('All fields must have a name');

    setLoading(true);

    try {
      // 2. REAL API CALL (This replaces the console.log)
      const payload = {
        name: name.trim(),
        schema: {
          fields: fields.map(field => ({
            name: field.name.trim(),
            type: field.type
          }))
        }
      };

      console.log("Sending to Backend...", payload);
      
      // This line sends the data to your .NET API
      await api.post('/ContentTypes', payload);
      
      // Success! Redirect to list with full page refresh
      window.location.href = '/content-types'; 

    } catch (error: any) {
      console.error('API Error:', error);
      alert('Failed to save. Check your backend console.');
    } finally {
      setLoading(false);
    }
  };

  // --- UI RENDER ---
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/content-types')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-dark">Create Content Types</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <label className="block text-sm font-bold text-dark mb-2">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Blog Post"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-dark">Schema Fields</h2>
            <button type="button" onClick={() => setShowFieldModal(true)} className="flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-md text-sm font-medium">
              <Plus size={16} /> Add Field
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-white">
                <div className="flex-1">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateField(index, e.target.value)}
                    placeholder="field_name"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded font-mono"
                  />
                </div>
                <div className="w-32 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600 font-medium">
                  {field.type}
                </div>
                <button type="button" onClick={() => removeField(index)} className="p-2 text-gray-400 hover:text-red-500">
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover font-bold">
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Content Type'}
          </button>
        </div>
      </form>

      {/* Simple Modal for selecting types */}
      {showFieldModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
               <h3 className="font-bold">Select Type</h3>
               <button onClick={() => setShowFieldModal(false)}><X size={20} /></button>
            </div>
            <div className="p-2 grid grid-cols-1 gap-2">
              {FIELD_TYPES.map((type) => (
                <button key={type.value} onClick={() => addField(type.value)} className="text-left p-3 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100">
                  <span className="block font-bold text-sm">{type.label}</span>
                  <span className="block text-xs text-gray-500">{type.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}