import { useState } from 'react';
import { Book, Code, Key, Server, Copy, Check } from 'lucide-react';

export default function Documentation() {
  const [copied, setCopied] = useState(false);

  // Add your Backend URL here
  const BASE_URL = "https://your-api-domain.com/api";

  const exampleCode = `
// Example: Fetching Blog Posts (Content Type ID: 1)
const response = await fetch('${BASE_URL}/Delivery/1?Page=1&PageSize=10', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'YOUR_API_KEY_HERE' // Get this from Settings
  }
});

const data = await response.json();
console.log(data);
  `;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-10">

      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Book className="text-blue-600" />
          API Documentation
        </h1>
        <p className="mt-2 text-gray-600 text-lg">
          Welcome to the SchemaFlow API. Use this guide to integrate your content into your website or app.
        </p>
      </div>

      {/* 1. Authentication Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Key className="text-gray-500" size={20} />
          Authentication
        </h2>
        <p className="text-gray-600">
          All API requests must be authenticated using an <strong>API Key</strong>. You can generate a key in the Settings page.
          Pass this key in the request header.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm text-gray-700">
          X-Api-Key: sk_live_xxxxxxxxxxxx
        </div>
      </section>

      {/* 2. Endpoints Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Server className="text-gray-500" size={20} />
          Endpoints
        </h2>

        {/* Get All Entries */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded font-bold text-xs uppercase">GET</span>
            <code className="text-sm font-mono text-gray-800">/Delivery/{'{contentTypeId}'}</code>
          </div>
          <p className="text-gray-600 mb-4">
            Retrieve a paginated list of entries for a specific content type.
          </p>

          <h3 className="font-semibold text-sm text-gray-700 mb-2">Query Parameters:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-2">
            <li><code className="bg-gray-100 px-1 rounded">Page</code> (optional): Page number (default: 1)</li>
            <li><code className="bg-gray-100 px-1 rounded">PageSize</code> (optional): Items per page (default: 10)</li>
            <li><code className="bg-gray-100 px-1 rounded">SearchTerm</code> (optional): Filter entries by text</li>
          </ul>
        </div>

        {/* Get Single Entry */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded font-bold text-xs uppercase">GET</span>
            <code className="text-sm font-mono text-gray-800">/Delivery/{'{contentTypeId}'}/{'{entryId}'}</code>
          </div>
          <p className="text-gray-600">
            Retrieve a single entry by its unique ID.
          </p>
        </div>
      </section>

      {/* 3. Code Example Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Code className="text-gray-500" size={20} />
          Integration Example (JavaScript)
        </h2>
        <div className="relative group">
          <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
            {exampleCode}
          </pre>
          <button
            onClick={copyToClipboard}
            className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy Code"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        </div>
      </section>

      {/* 4. Response Structure */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Response Format</h2>
        <p className="text-gray-600">Responses are returned in standard JSON format.</p>
        <pre className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-sm text-gray-700 font-mono">
{`{
  "totalRecords": 100,
  "page": 1,
  "pageSize": 10,
  "data": [
    {
      "id": 1,
      "data": {
        "Headline": "Hello World",
        "CoverImage": "https://res.cloudinary.com/...",
        "IsActive": true
      },
      "isVisible": true,
      "createdAt": "2026-02-14T..."
    }
  ]
}`}
        </pre>
      </section>

    </div>
  );
}