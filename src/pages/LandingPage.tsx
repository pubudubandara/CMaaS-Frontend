import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Code,
  Terminal,
  Key,
  Server,
  Copy,
  Check,
  CheckCircle,
  Zap,
  ShieldCheck,
  Globe,
  Layers,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : "https://your-api-domain.com/api";

  const exampleCode = `// Example: Fetching all Blog Posts
const response = await fetch('${BASE_URL}/Delivery/BlogPosts', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'YOUR_API_KEY_HERE'
  }
});

const data = await response.json();
console.log(data);

// Example: Fetching a specific Blog Post by ID
const response2 = await fetch('${BASE_URL}/Delivery/BlogPosts/123', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'YOUR_API_KEY_HERE'
  }
});

const post = await response2.json();
console.log(post);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-dark selection:bg-primary/20">
      {/* NAVBAR - Updated to link to #docs instead of a modal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 font-bold text-lg tracking-tight text-white cursor-pointer"
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <img src="/logo.png" alt="Logo" className="w-5 h-5" />
            </div>
            SchemaFlow
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#docs" className="hover:text-primary transition-colors">
              Developers
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-md text-sm font-bold transition-colors shadow-lg shadow-primary/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10" />

        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-dark mb-6 leading-[1.1] md:leading-[0.9]">
          Content for the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
            API Generation.
          </span>
        </h1>

        <p className="text-xl text-dark-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          The headless CMS that doesn't head-ache. Define schemas, generate
          APIs, and ship content to any platform in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="group relative px-8 py-4 bg-primary text-white font-bold rounded-full overflow-hidden shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50 hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Building Free <ArrowRight size={18} />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          <a
            href="#docs"
            className="px-8 py-4 bg-white text-dark border border-border font-bold rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Terminal size={18} className="text-dark-muted" />
            Read the Docs
          </a>
        </div>
      </header>

      {/* DOCUMENTATION / INTEGRATION SECTION (Replaces Modal) */}
      <section
        id="docs"
        className="py-24 px-6 bg-surface border-y border-gray-100"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            {/* Left Column: Explainer */}
            <div className="flex-1 space-y-10">
              <div>
                <h2 className="text-4xl font-black text-dark mb-4">
                  Integrate in minutes,
                  <br />
                  not days.
                </h2>
                <p className="text-lg text-dark-muted">
                  SchemaFlow provides a standardized REST API for all your
                  content types automatically. No boilerplate required.
                </p>
              </div>

              {/* Step 1: Auth */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Key className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">
                    1. Authentication
                  </h3>
                  <p className="text-dark-muted mb-3">
                    Secure your requests using standard API keys. Generate keys
                    in your dashboard with granular permissions.
                  </p>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-700 border border-gray-200">
                    X-Api-Key: cmaas__xxxxxxxxxxxx
                  </code>
                </div>
              </div>

              {/* Step 2: Endpoints */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                  <Server className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">
                    2. Dynamic Endpoints
                  </h3>
                  <p className="text-dark-muted mb-3">
                    Every content type you create automatically gets a dedicated
                    endpoint.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                        GET
                      </span>
                      <code className="text-sm font-mono text-gray-600">
                        /Delivery/{"{typeId}"}
                      </code>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                        GET
                      </span>
                      <code className="text-sm font-mono text-gray-600">
                        /Delivery/{"{typeId}"}/{"{entryId}"}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Code Example */}
            <div className="flex-1 w-full md:sticky md:top-32">
              <div className="bg-dark rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    fetch-posts.js
                  </div>
                </div>
                <div className="relative group">
                  <pre className="p-6 text-sm md:text-base font-mono leading-relaxed overflow-x-auto text-gray-300">
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-400">response</span> ={" "}
                    <span className="text-purple-400">await</span>{" "}
                    <span className="text-yellow-300">fetch</span>({"\n"}{" "}
                    <span className="text-green-300">
                      '{BASE_URL}/Delivery/1'
                    </span>
                    , {"{"}
                    {"\n"} <span className="text-blue-300">method</span>:{" "}
                    <span className="text-green-300">'GET'</span>,{"\n"}{" "}
                    <span className="text-blue-300">headers</span>: {"{"}
                    {"\n"}{" "}
                    <span className="text-green-300">'Content-Type'</span>:{" "}
                    <span className="text-green-300">'application/json'</span>,
                    {"\n"} <span className="text-green-300">'X-Api-Key'</span>:{" "}
                    <span className="text-green-300">'cmaas__xxxxxxxxxxxx'</span>
                    {"\n"} {"}"}
                    {"\n"} {"}"}
                    {"\n"});
                    {"\n\n"}
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-400">data</span> ={" "}
                    <span className="text-purple-400">await</span>{" "}
                    <span className="text-blue-400">response</span>.
                    <span className="text-yellow-300">json</span>();
                  </pre>
                </div>
              </div>

              {/* Optional: Capability badges below code */}
              <div className="flex gap-4 mt-6 justify-center">
                <div className="flex items-center gap-2 text-sm text-dark-muted">
                  <Zap size={16} className="text-yellow-500" /> 99.9% Uptime
                </div>
                <div className="flex items-center gap-2 text-sm text-dark-muted">
                  <Globe size={16} className="text-blue-500" /> Global Edge
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-dark mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-dark-muted">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-dark mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-dark">$0</span>
                <span className="text-dark-muted">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "1 Content Type",
                  "100 Entries",
                  "1K API Requests/mo",
                  "Community Support",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-dark-muted"
                  >
                    <CheckCircle
                      size={20}
                      className="text-green-500 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/register")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-dark font-bold py-3 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-primary rounded-2xl p-8 border-2 border-primary shadow-xl transform md:-translate-y-4 hover:scale-105 transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-400 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">$29</span>
                <span className="text-gray-100">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "10 Content Types",
                  "10,000 Entries",
                  "100K API Requests/mo",
                  "Priority Support",
                  "Custom Webhooks",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-white">
                    <CheckCircle size={20} className="text-white shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/register")}
                className="w-full bg-white hover:bg-gray-50 text-primary font-bold py-3 rounded-lg transition-colors shadow-md"
              >
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-dark mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-dark">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited Content Types",
                  "Unlimited Entries",
                  "Unlimited Requests",
                  "24/7 Dedicated Support",
                  "SLA Guarantee",
                  "On-Premise Option",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-dark-muted"
                  >
                    <CheckCircle
                      size={20}
                      className="text-green-500 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-dark hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-dark rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10">
            Ready to go <span className="text-primary">headless?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto relative z-10">
            Join 10,000+ developers building faster websites and apps with
            SchemaFlow.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors text-lg shadow-lg"
            >
              Get Started for Free
            </button>
            <button className="px-8 py-4 bg-transparent border border-gray-600 text-white font-bold rounded-full hover:bg-gray-800 transition-colors text-lg">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-dark">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white">
              <img src="/logo.png" alt="Logo" className="w-3.5 h-3.5" />
            </div>
            SchemaFlow
          </div>
          <div className="text-dark-muted text-sm">
            © 2026 SchemaFlow Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Layers
              size={20}
              className="text-gray-400 hover:text-dark cursor-pointer transition-colors"
            />
            <ShieldCheck
              size={20}
              className="text-gray-400 hover:text-dark cursor-pointer transition-colors"
            />
            <Globe
              size={20}
              className="text-gray-400 hover:text-dark cursor-pointer transition-colors"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
