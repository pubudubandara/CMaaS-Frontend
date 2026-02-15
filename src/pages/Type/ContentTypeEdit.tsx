import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, Type, Calendar, Hash, ToggleLeft, List, FileText, Lock, Image } from 'lucide-react';
import api from '../../lib/axios';

// Match backend types
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

export default function ContentTypeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [typeName, setTypeName] = useState('');
  // We separate existing (locked) fields from new (editable) fields
  const [existingFields, setExistingFields] = useState<FieldDefinition[]>([]);
  const [newFields, setNewFields] = useState<FieldDefinition[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) fetchContentType();
  }, [id]);

  const fetchContentType = async () => {
    try {
      const res = await api.get(`/ContentTypes/${id}`);
      setTypeName(res.data.name);
      // Store fetched fields in 'existingFields' to lock them
      setExistingFields(res.data.schema?.fields || []);
    } catch (error) {
      console.error("Failed to load content type", error);
      alert("Error loading schema");
    } finally {
      setLoading(false);
    }
  };

  const addNewField = () => {
    setNewFields([...newFields, { name: '', type: 'string' }]);
  };

  const updateNewField = (index: number, key: keyof FieldDefinition, value: any) => {
    const updated = [...newFields];
    // @ts-ignore
    updated[index][key] = value;
    setNewFields(updated);
  };

  const removeNewField = (index: number) => {
    setNewFields(newFields.filter((_, i) => i !== index));
  };

  const saveSchema = async () => {
    if (!typeName.trim()) return alert("Content Type Name is required");
    if (newFields.some(f => !f.name.trim())) return alert("All new fields must have a name");

    // Check for duplicate names (New fields cannot match Existing fields)
    const existingNames = new Set(existingFields.map(f => f.name.toLowerCase()));
    for (const field of newFields) {
        if (existingNames.has(field.name.toLowerCase())) {
            return alert(`Field name "${field.name}" already exists!`);
        }
    }

    setSaving(true);

    // MERGE Existing + New fields
    const schemaPayload = {
      name: typeName.trim(),
      schema: {
        fields: [
            ...existingFields, // Keep old fields
            ...newFields.map(f => ({ name: f.name.trim(), type: f.type })) 
        ]
      }
    };

    try {
      console.log("Updating Schema:", schemaPayload);
      await api.put(`/ContentTypes/${id}`, schemaPayload); 
      navigate('/content-types'); 
    } catch (error) {
      console.error("Failed to update:", error);
      alert("Failed to update schema. Check console.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Schema...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20}/></button>
            <div>
                <h1 className="text-2xl font-bold text-dark">Edit Content Type</h1>
                <p className="text-sm text-dark-muted">Manage fields for {typeName}</p>
            </div>
        </div>
        <button 
            onClick={saveSchema} 
            disabled={saving}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "Updating..." : "Update Schema"}
        </button>
      </div>

      {/* Name Section (Editable) */}
      <div className="bg-white border border-border rounded-lg p-6 shadow-sm mb-6">
        <label className="block text-sm font-bold text-dark mb-1">Content Type Name</label>
        <input 
          type="text" 
          className="w-full max-w-md border-border rounded focus:ring-primary focus:border-primary text-sm p-2 border"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
        />
      </div>

      {/* Fields Section */}
      <div className="bg-white border border-border rounded-lg shadow-sm">
        <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h3 className="font-bold text-dark text-sm">Schema Fields</h3>
          <button onClick={addNewField} className="text-white bg-dark hover:bg-gray-800 px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1 transition-colors">
            <Plus size={16} /> ADD NEW FIELD
          </button>
        </div>
        
        <div className="p-4 space-y-3">
          
          {/* 1. EXISTING FIELDS (LOCKED) */}
          {existingFields.map((field, index) => (
            <div key={`existing-${index}`} className="flex flex-col sm:flex-row items-end gap-3 p-3 border border-gray-200 bg-gray-50 rounded opacity-80 relative">
              
               {/* Lock Indicator */}
               <div className="absolute -top-2 -right-2 bg-gray-200 text-gray-500 p-1 rounded-full shadow-sm" title="Field is locked">
                 <Lock size={12} />
               </div>

              {/* Read-Only Name */}
              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Field Name (Locked)</label>
                <input 
                  type="text" 
                  value={field.name}
                  disabled
                  className="w-full border-gray-300 bg-gray-100 rounded text-sm py-1.5 px-2 border text-gray-500 cursor-not-allowed font-mono" 
                />
              </div>

              {/* Read-Only Type */}
              <div className="w-full sm:w-48">
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Data Type</label>
                <div className="w-full border-gray-300 bg-gray-100 rounded text-sm py-1.5 px-2 border text-gray-500 cursor-not-allowed">
                    {FIELD_TYPES.find(t => t.value === field.type)?.label || field.type}
                </div>
              </div>

              {/* Placeholder for alignment */}
              <div className="p-2 w-9"></div> 
            </div>
          ))}

          {/* 2. NEW FIELDS (EDITABLE) */}
          {newFields.map((field, index) => (
            <div key={`new-${index}`} className="flex flex-col sm:flex-row items-end gap-3 p-3 border-2 border-primary/20 rounded bg-white hover:border-primary/50 transition-colors group">
              
              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold text-primary uppercase mb-1 block">New Field Name</label>
                <input 
                  type="text" 
                  value={field.name}
                  onChange={(e) => updateNewField(index, 'name', e.target.value)}
                  className="w-full border-border rounded text-sm py-1.5 px-2 border focus:ring-primary focus:border-primary font-mono" 
                  placeholder="e.g. description"
                  autoFocus
                />
              </div>

              <div className="w-full sm:w-48">
                <label className="text-[10px] font-bold text-primary uppercase mb-1 block">Data Type</label>
                <div className="relative">
                    <select 
                      value={field.type}
                      onChange={(e) => updateNewField(index, 'type', e.target.value)}
                      className="w-full border-border rounded text-sm py-1.5 pl-2 pr-8 border focus:ring-primary focus:border-primary bg-white appearance-none cursor-pointer"
                    >
                      {FIELD_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                </div>
              </div>

              <button 
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors mb-[1px]" 
                onClick={() => removeNewField(index)}
                title="Remove New Field"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {existingFields.length === 0 && newFields.length === 0 && (
             <div className="text-center py-8 text-gray-400 italic">No fields defined yet.</div>
          )}

        </div>
      </div>
    </div>
  );
}