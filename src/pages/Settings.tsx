import { useState } from 'react';
import { 
  Key, Copy, Trash2, Shield, CreditCard, User, 
  Check, AlertTriangle, Plus 
} from 'lucide-react';

// Mock Data for API Keys
const MOCK_KEYS = [
  { id: 1, name: "Production Key", prefix: "pk_live_...", created: "2025-10-01", lastUsed: "2 mins ago" },
  { id: 2, name: "Development Key", prefix: "pk_test_...", created: "2025-11-15", lastUsed: "1 day ago" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('api-keys');

  return (
    <div className="max-w-6xl mx-auto flex gap-8">
      
      {/* 1. Settings Sidebar (Navigation) */}
      <aside className="w-64 flex-shrink-0">
        <h1 className="text-2xl font-bold text-dark mb-6">Settings</h1>
        <nav className="space-y-1">
          <SettingsTab 
            id="profile" 
            label="General Profile" 
            icon={User} 
            active={activeTab === 'profile'} 
            onClick={setActiveTab} 
          />
          <SettingsTab 
            id="api-keys" 
            label="API Keys" 
            icon={Key} 
            active={activeTab === 'api-keys'} 
            onClick={setActiveTab} 
          />
          <SettingsTab 
            id="billing" 
            label="Billing & Usage" 
            icon={CreditCard} 
            active={activeTab === 'billing'} 
            onClick={setActiveTab} 
          />
          <SettingsTab 
            id="team" 
            label="Team Members" 
            icon={Shield} 
            active={activeTab === 'team'} 
            onClick={setActiveTab} 
          />
        </nav>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 bg-white border border-border rounded-lg shadow-sm min-h-[500px]">
        {activeTab === 'api-keys' && <APIKeysPanel />}
        {activeTab === 'profile' && <ProfilePanel />}
        {activeTab === 'billing' && <BillingPanel />}
        {/* Add other panels as needed */}
      </div>

    </div>
  );
}

// --- Sub-Components ---

// 1. Navigation Tab Component
function SettingsTab({ id, label, icon: Icon, active, onClick }: any) {
  return (
    <button 
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
        active 
          ? 'bg-primary-light text-primary font-bold' 
          : 'text-dark-muted hover:bg-gray-100 hover:text-dark'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

// 2. API Keys Panel (The Core Feature)
function APIKeysPanel() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (id: number, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6 border-b border-border pb-6">
        <div>
          <h2 className="text-lg font-bold text-dark">API Keys</h2>
          <p className="text-sm text-dark-muted mt-1">
            Manage the keys used to access your content from your frontend applications.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-primary-hover transition-colors shadow-sm">
          <Plus size={16} /> Generate New Key
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_KEYS.map((key) => (
          <div key={key.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-gray-300 transition-colors bg-gray-50/30">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-dark text-sm">{key.name}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <code className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 font-mono border border-gray-200">
                  {key.prefix}********************
                </code>
                <span className="text-xs text-dark-muted">• Created on {key.created}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-dark-muted hidden sm:block">Last used {key.lastUsed}</span>
              
              <button 
                onClick={() => handleCopy(key.id, "pk_live_real_key_would_be_here")}
                className="p-2 text-gray-400 hover:text-primary hover:bg-primary-light rounded transition-colors"
                title="Copy Key"
              >
                {copiedId === key.id ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              </button>
              
              <button 
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Revoke Key"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-md flex gap-3">
        <AlertTriangle className="text-orange-500 flex-shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-bold text-orange-800">Security Note</h4>
          <p className="text-xs text-orange-700 mt-1">
            Your secret keys grant full access to your content. Do not commit them to GitHub. 
            Use environment variables (e.g., <code className="bg-white/50 px-1 rounded">.env.local</code>) to store them safely.
          </p>
        </div>
      </div>
    </div>
  );
}

// 3. Profile Panel (Simple Form)
function ProfilePanel() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold text-dark mb-1">Organization Profile</h2>
      <p className="text-sm text-dark-muted mb-6">Update your organization details and contact info.</p>

      <form className="space-y-5 max-w-lg">
        <div>
          <label className="block text-sm font-bold text-dark mb-1">Organization Name</label>
          <input 
            type="text" 
            defaultValue="PubuduCorp"
            className="w-full border-border rounded focus:ring-primary focus:border-primary text-sm p-2 border" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-dark mb-1">Admin Email</label>
          <input 
            type="email" 
            defaultValue="pubudu@example.com"
            disabled
            className="w-full border-border rounded bg-gray-100 text-gray-500 text-sm p-2 border cursor-not-allowed" 
          />
          <p className="text-xs text-gray-400 mt-1">Contact support to change your email.</p>
        </div>

        <div className="pt-4">
          <button className="px-4 py-2 bg-dark text-white text-sm font-bold rounded hover:bg-gray-800 transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// 4. Billing Panel (Placeholder)
function BillingPanel() {
  return (
    <div className="p-6 flex flex-col items-center justify-center h-full text-center py-20">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <CreditCard size={32} className="text-gray-400" />
      </div>
      <h2 className="text-lg font-bold text-dark">Free Tier Active</h2>
      <p className="text-sm text-dark-muted max-w-xs mt-2">
        You are currently on the free Developer plan. Upgrade to scale your content.
      </p>
      <button className="mt-6 px-4 py-2 border border-gray-300 text-dark text-sm font-bold rounded hover:bg-gray-50 transition-colors">
        View Plans
      </button>
    </div>
  );
}