import { useState, useEffect } from 'react';
import { Copy, Trash2, AlertTriangle, Plus, Check, Loader2, Key } from 'lucide-react';
import api from '../../lib/axios';

interface ApiKey {
  id: number;
  name: string;
  key: string; // The full key is only returned on creation
  createdAt: string;
}

export default function APIKeysPanel() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Creation Form State
  const [newKeyName, setNewKeyName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Success Popup State
  const [createdKey, setCreatedKey] = useState<ApiKey | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/ApiKeys');
      setApiKeys(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) return;

    try {
      setCreating(true);
      setError(null);
      
      const response = await api.post('/ApiKeys', { name: newKeyName.trim() });
      
      // 1. Set the created key to show the popup
      setCreatedKey(response.data);
      
      // 2. Reset form
      setNewKeyName('');
      setShowCreateForm(false);
      
      // 3. Refresh list in background
      fetchApiKeys(); 
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const deleteApiKey = async (id: number) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      setDeletingId(id);
      setError(null);
      await api.delete(`/ApiKeys/${id}`);
      await fetchApiKeys(); 
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete API key');
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey.key);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const closeSuccessModal = () => {
    setCreatedKey(null);
    setHasCopied(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && apiKeys.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={24} />
        <span className="ml-2 text-dark-muted">Loading API keys...</span>
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-start mb-6 border-b border-border pb-6">
        <div>
          <h2 className="text-lg font-bold text-dark">API Keys</h2>
          <p className="text-sm text-dark-muted mt-1">
            Manage the keys used to access your content.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50"
          disabled={creating}
        >
          <Plus size={16} />
          {showCreateForm ? 'Cancel' : 'Generate New Key'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Creation Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 border border-border rounded-lg bg-gray-50 animate-in fade-in slide-in-from-top-2">
          <h3 className="text-sm font-bold text-dark mb-3">Create New API Key</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter key name (e.g., Production Key)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded focus:ring-primary focus:border-primary text-sm"
              onKeyPress={(e) => e.key === 'Enter' && createApiKey()}
            />
            <button
              onClick={createApiKey}
              disabled={creating || !newKeyName.trim()}
              className="px-4 py-2 bg-dark text-white text-sm font-bold rounded hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {creating && <Loader2 className="animate-spin" size={14} />}
              Create
            </button>
          </div>
        </div>
      )}

      {/* API Keys List */}
      <div className="space-y-3">
        {apiKeys.length === 0 ? (
          <div className="text-center py-12 text-dark-muted border-2 border-dashed border-gray-100 rounded-lg">
            <Key className="mx-auto mb-2 opacity-20" size={32} />
            <p>No API keys found.</p>
          </div>
        ) : (
          apiKeys.map((key) => (
            <div key={key.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-gray-300 transition-colors bg-white">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-dark text-sm">{key.name}</span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Active</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-500 font-mono border border-gray-200">
                    {/* Show only suffix for existing keys */}
                    ••••{key.key ? key.key.slice(-4) : '****'} 
                  </code>
                  <span className="text-xs text-dark-muted">• Created {formatDate(key.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Removed Copy Button from here as requested */}
                
                <button
                  onClick={() => deleteApiKey(key.id)}
                  disabled={deletingId === key.id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  title="Revoke Key"
                >
                  {deletingId === key.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Security Note */}
      <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-md flex gap-3">
        <AlertTriangle className="text-orange-500 flex-shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-bold text-orange-800">Security Note</h4>
          <p className="text-xs text-orange-700 mt-1">
            Your secret keys grant full access. Do not share them publicly.
          </p>
        </div>
      </div>

      {/* SUCCESS POPUP MODAL */}
      {createdKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
            
            <div className="bg-green-50 p-6 text-center border-b border-green-100">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600">
                <Check size={24} strokeWidth={3} />
              </div>
              <h3 className="text-lg font-bold text-dark">API Key Generated!</h3>
              <p className="text-sm text-gray-600 mt-1">
                Please copy this key now. You won't be able to see it again.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-dark-muted uppercase mb-1 block">Your API Key</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    readOnly 
                    value={createdKey.key} 
                    className="w-full bg-gray-50 border border-gray-300 text-dark font-mono text-sm rounded-lg py-3 pl-3 pr-12 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                  <button 
                    onClick={copyToClipboard}
                    className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-md transition-all"
                    title="Copy to clipboard"
                  >
                    {hasCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-md flex gap-2 border border-yellow-100">
                <AlertTriangle className="text-yellow-600 shrink-0" size={16} />
                <p className="text-xs text-yellow-700">
                  Make sure to store this key safely. It will not be shown again.
                </p>
              </div>

              <button 
                onClick={closeSuccessModal}
                className="w-full py-2.5 bg-dark text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
              >
                I have copied it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}