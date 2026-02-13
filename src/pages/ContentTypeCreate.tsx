import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Save, ArrowLeft } from 'lucide-react';
import api from '../lib/axios';

interface Field {
  fieldName: string;
  fieldType: string;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text', description: 'Single line text input' },
  { value: 'number', label: 'Number', description: 'Numeric input' },
  { value: 'date', label: 'Date', description: 'Date picker' },
  { value: 'boolean', label: 'Boolean', description: 'Yes/No checkbox' },
  { value: 'richtext', label: 'Rich Text', description: 'Rich text editor' },
];

export default function ContentTypeCreate() {
  const [name, setName] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addField = (fieldType: string) => {
    const fieldTypeData = FIELD_TYPES.find(ft => ft.value === fieldType);
    if (!fieldTypeData) return;

    const newField: Field = {
      fieldName: '',
      fieldType: fieldType,
    };
    setFields([...fields, newField]);
    setShowFieldModal(false);
  };

  const updateField = (index: number, fieldName: string) => {
    const updatedFields = [...fields];
    updatedFields[index].fieldName = fieldName;
    setFields(updatedFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || fields.length === 0) {
      alert('Please provide a name and at least one field');
      return;
    }

    // Validate all fields have names
    if (fields.some(field => !field.fieldName.trim())) {
      alert('All fields must have a name');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        fields: fields.map(field => ({
          fieldName: field.fieldName.trim(),
          fieldType: field.fieldType,
        })),
      };

      await api.post('/ContentTypes', payload);
      navigate('/content-types');
    } catch (error) {
      console.error('Failed to create content type:', error);
      alert('Failed to create content type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/content-types')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-dark">Create Content Type</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content Type Name */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <label className="block text-sm font-medium text-dark mb-2">
            Content Type Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Product, Blog Post, Employee"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>

        {/* Fields Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-dark">Fields</h2>
            <button
              type="button"
              onClick={() => setShowFieldModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              <Plus size={16} />
              Add Field
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Plus size={32} className="mx-auto mb-2 text-gray-300" />
              <p>No fields added yet. Click "Add Field" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={field.fieldName}
                      onChange={(e) => updateField(index, e.target.value)}
                      placeholder="Field name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="w-32">
                    <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                      field.fieldType === 'text' ? 'bg-blue-100 text-blue-700' :
                      field.fieldType === 'number' ? 'bg-green-100 text-green-700' :
                      field.fieldType === 'date' ? 'bg-purple-100 text-purple-700' :
                      field.fieldType === 'boolean' ? 'bg-yellow-100 text-yellow-700' :
                      field.fieldType === 'richtext' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {FIELD_TYPES.find(ft => ft.value === field.fieldType)?.label || field.fieldType}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {loading ? 'Creating...' : 'Create Content Type'}
          </button>
        </div>
      </form>

      {/* Field Type Modal */}
      {showFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-dark mb-4">Select Field Type</h3>
            <div className="space-y-3">
              {FIELD_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => addField(type.value)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-dark">{type.label}</div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowFieldModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}