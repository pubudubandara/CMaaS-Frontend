import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, Type, Calendar, Hash, ToggleLeft, List, FileText, Image } from 'lucide-react';
import api from '../../lib/axios';

// 1. MATCH BACKEND TYPES
const FIELD_TYPES = [
  { value: 'string', label: 'Text (String)', icon: Type },
  { value: 'richtext', label: 'Rich Text', icon: FileText },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'datetime', label: 'Date & Time', icon: Calendar },
  { value: 'boolean', label: 'Boolean', icon: ToggleLeft },
  { value: 'array', label: 'Array / Tags', icon: List },
  { value: 'image', label: 'Image Upload', icon: Image },
];

interface FieldDefinition {
  name: string;
  type: string;
}

export default function SchemaBuilder() {
  const navigate = useNavigate();
  const [typeName, setTypeName] = useState('');
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [loading, setLoading] = useState(false);

  const addField = () => {
    // Default to 'string' type
    setFields([...fields, { name: '', type: 'string' }]);
  };

  const updateField = (index: number, key: keyof FieldDefinition, value: any) => {
    const newFields = [...fields];
    // @ts-ignore - dynamic key assignment
    newFields[index][key] = value;
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const saveSchema = async () => {
    // Validation
    if (!typeName.trim()) return alert("Please enter a Content Type Name");
    if (fields.length === 0) return alert("Please add at least one field");
    if (fields.some(f => !f.name.trim())) return alert("All fields must have a name");

    setLoading(true);

    // 2. CORRECT PAYLOAD STRUCTURE
    const schemaPayload = {
      name: typeName.trim(),
      schema: {
        fields: fields.map(field => ({
            name: field.name.trim(),
            type: field.type
        }))
      }
    };

    try {
      console.log("Sending to Backend:", schemaPayload);
      
      // 3. REAL API CALL
      await api.post('/ContentTypes', schemaPayload);
      
      // Success - Redirect
      navigate('/content-types'); 
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save schema. Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20}/></button>
            <div>
                <h1 className="text-2xl font-bold text-dark">Schema Builder</h1>
                <p className="text-sm text-dark-muted">Define the structure of your content types.</p>
            </div>
        </div>
        <button 
            onClick={saveSchema} 
            disabled={loading}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Save size={16} /> {loading ? "Saving..." : "Save Schema"}
        </button>
      </div>

      {/* Type Name Section */}
      <div className="bg-white border border-border rounded-lg p-6 shadow-sm mb-6">
        <label className="block text-sm font-bold text-dark mb-1">Content Type Name</label>
        <input 
          type="text" 
          className="w-full max-w-md border-border rounded focus:ring-primary focus:border-primary text-sm p-2 border"
          placeholder="e.g. Article"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
        />
      </div>

      {/* Fields Section */}
      <div className="bg-white border border-border rounded-lg shadow-sm">
        <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h3 className="font-bold text-dark text-sm">Fields Definition</h3>
          <button onClick={addField} className="text-white bg-dark hover:bg-gray-800 px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1 transition-colors">
            <Plus size={16} /> ADD FIELD
          </button>
        </div>
        
        <div className="p-4 space-y-3">
          {fields.length === 0 ? (
            <div className="text-center py-12 text-dark-muted text-sm border-2 border-dashed border-border rounded bg-gray-50/50">
              <p>No fields added yet.</p>
              <button onClick={addField} className="text-primary font-bold mt-2 hover:underline">Click to add your first field</button>
            </div>
          ) : (
            fields.map((field, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-end gap-3 p-3 border border-border rounded bg-white hover:border-primary/50 transition-colors group">
                
                {/* Field Name Input */}
                <div className="flex-1 w-full">
                  <label className="text-[10px] font-bold text-dark-muted uppercase mb-1 block">Field Name (JSON Key)</label>
                  <input 
                    type="text" 
                    value={field.name}
                    onChange={(e) => updateField(index, 'name', e.target.value)}
                    className="w-full border-border rounded text-sm py-1.5 px-2 border focus:ring-primary focus:border-primary font-mono" 
                    placeholder="e.g. headline"
                  />
                </div>

                {/* Field Type Select */}
                <div className="w-full sm:w-48">
                  <label className="text-[10px] font-bold text-dark-muted uppercase mb-1 block">Data Type</label>
                  <div className="relative">
                      <select 
                        value={field.type}
                        onChange={(e) => updateField(index, 'type', e.target.value)}
                        className="w-full border-border rounded text-sm py-1.5 pl-2 pr-8 border focus:ring-primary focus:border-primary bg-white appearance-none cursor-pointer"
                      >
                        {FIELD_TYPES.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow if needed, but browser default is fine */}
                  </div>
                </div>

                {/* Remove Button */}
                <button 
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors mb-[1px]" 
                  onClick={() => removeField(index)}
                  title="Remove Field"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}