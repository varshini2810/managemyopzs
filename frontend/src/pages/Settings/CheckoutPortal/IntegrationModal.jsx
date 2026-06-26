import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Copy, Check, Plus, Code2, TerminalSquare } from 'lucide-react';

const FAMILIES = ['HRMS', 'CRM', 'Analytics', 'Finance', 'ERP'];
const PLANS = {
  HRMS: ['Basic', 'Professional', 'Enterprise'],
  CRM: ['Starter', 'Professional', 'Premium'],
  Analytics: ['Basic', 'Advanced', 'Enterprise'],
  Finance: ['Standard'],
  ERP: ['Standard']
};
const CURRENCIES = [
  { code: 'USD', flag: '🇺🇸' },
  { code: 'INR', flag: '🇮🇳' },
  { code: 'EUR', flag: '🇪🇺' },
  { code: 'GBP', flag: '🇬🇧' },
  { code: 'AED', flag: '🇦🇪' }
];
const FREQUENCIES = ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly'];
const ADDON_OPTIONS = ['Additional Users', 'Premium Support', 'API Access', 'Data Backup', 'Custom Reports'];
const CHARGE_OPTIONS = ['Setup Fee', 'Migration Fee', 'Training Fee', 'Installation Fee'];

export default function IntegrationModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('script');
  
  // Form State
  const [family, setFamily] = useState('');
  const [plan, setPlan] = useState('');
  const [currency, setCurrency] = useState('');
  const [frequency, setFrequency] = useState('');
  const [addons, setAddons] = useState([]);
  const [charges, setCharges] = useState([]);
  
  // Generated Code
  const [generatedCode, setGeneratedCode] = useState('');

  // Dropdown UI States
  const [openDropdown, setOpenDropdown] = useState(null); // 'addons', 'charges', null

  useEffect(() => {
    if (!isOpen) return;
    
    // Auto-update generated code
    if (family && plan && currency && frequency) {
      let code = `<a href="javascript:void(0)"\n  data-opz-type="checkout"\n  data-product-family="${family}"\n  data-plan="${plan}"\n  data-currency="${currency}"\n  data-frequency="${frequency}"`;
      
      if (addons.length > 0) {
        code += `\n  data-addons="${addons.join(',')}"`;
      }
      if (charges.length > 0) {
        code += `\n  data-charges="${charges.join(',')}"`;
      }
      
      code += `>\n  Subscribe\n</a>`;
      setGeneratedCode(code);
    } else {
      setGeneratedCode('<!-- Select options above to generate code -->');
    }
  }, [family, plan, currency, frequency, addons, charges, isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const toggleAddon = (addon) => {
    setAddons(prev => prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]);
  };

  const toggleCharge = (charge) => {
    setCharges(prev => prev.includes(charge) ? prev.filter(c => c !== charge) : [...prev, charge]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[900px] max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Integrate with OPZ Checkout</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-gray-200 shrink-0 bg-gray-50">
          <button
            onClick={() => setActiveTab('script')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'script' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Via Drop-in Script
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'api' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Via API
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          {activeTab === 'script' && (
            <div className="space-y-8">
              
              {/* Section 1: Header Script */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <TerminalSquare size={16} className="text-[#6D28D9]" /> Header Script
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Copy and paste the code into the HTML header of your website/application. This needs to be done only once.
                  </p>
                </div>
                <div className="relative group">
                  <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-md overflow-x-auto font-mono">
{`<script src="https://js.opz.com/v2/opz.js"
  data-opz-site="your-site-name">
</script>`}
                  </pre>
                  <button 
                    onClick={() => handleCopy(`<script src="https://js.opz.com/v2/opz.js"\n  data-opz-site="your-site-name">\n</script>`)}
                    className="absolute top-2 right-2 p-1.5 bg-gray-800 text-gray-300 hover:text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Section 2: Checkout Button Builder */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Code2 size={16} className="text-[#6D28D9]" /> Checkout Button Code
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Choose the product family, plan, currency, billing frequency, addons, and charges to generate OPZ checkout code.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Product Family */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Product Family*</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md text-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] focus:border-[#6D28D9] bg-white"
                      value={family}
                      onChange={(e) => {
                        setFamily(e.target.value);
                        setPlan(''); // Reset dependent fields
                        setCurrency('');
                        setFrequency('');
                      }}
                    >
                      <option value="">Select family...</option>
                      {FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>

                  {/* Plan */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Choose Plan</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md text-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] focus:border-[#6D28D9] bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      value={plan}
                      onChange={(e) => {
                        setPlan(e.target.value);
                        setCurrency('');
                        setFrequency('');
                      }}
                      disabled={!family}
                    >
                      <option value="">Select plan...</option>
                      {family && PLANS[family]?.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Currency</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md text-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] focus:border-[#6D28D9] bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      value={currency}
                      onChange={(e) => {
                        setCurrency(e.target.value);
                        setFrequency('');
                      }}
                      disabled={!plan}
                    >
                      <option value="">Select currency...</option>
                      {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                    </select>
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Frequency</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md text-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] focus:border-[#6D28D9] bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      disabled={!currency}
                    >
                      <option value="">Select frequency...</option>
                      {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                {/* Addons & Charges Multi-selects */}
                <div className="mt-6 space-y-4">
                  {/* Addons */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-medium text-gray-700">Addons:</span>
                      {addons.map(addon => (
                        <span key={addon} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F3E8FF] text-[#6D28D9]">
                          {addon}
                          <button onClick={() => toggleAddon(addon)} className="hover:bg-[#6D28D9] hover:text-white rounded-full p-0.5"><X size={10} /></button>
                        </span>
                      ))}
                      <div className="relative">
                        <button 
                          onClick={() => setOpenDropdown(openDropdown === 'addons' ? null : 'addons')}
                          className="text-xs font-medium text-[#6D28D9] hover:text-[#5b21b6] flex items-center gap-1 px-2 py-1"
                        >
                          <Plus size={12} /> Add Addon
                        </button>
                        {openDropdown === 'addons' && (
                          <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1">
                            {ADDON_OPTIONS.map(opt => (
                              <button key={opt} onClick={() => { toggleAddon(opt); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex justify-between items-center text-gray-700">
                                {opt} {addons.includes(opt) && <Check size={12} className="text-[#6D28D9]" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Charges */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-medium text-gray-700">Charges:</span>
                      {charges.map(charge => (
                        <span key={charge} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {charge}
                          <button onClick={() => toggleCharge(charge)} className="hover:bg-gray-300 hover:text-gray-900 rounded-full p-0.5"><X size={10} /></button>
                        </span>
                      ))}
                      <div className="relative">
                        <button 
                          onClick={() => setOpenDropdown(openDropdown === 'charges' ? null : 'charges')}
                          className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 px-2 py-1 border border-dashed border-gray-300 rounded hover:border-gray-400"
                        >
                          <Plus size={12} /> Add Charge
                        </button>
                        {openDropdown === 'charges' && (
                          <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1">
                            {CHARGE_OPTIONS.map(opt => (
                              <button key={opt} onClick={() => { toggleCharge(opt); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex justify-between items-center text-gray-700">
                                {opt} {charges.includes(opt) && <Check size={12} className="text-gray-900" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generated Code Area */}
                <div className="mt-8 relative group">
                  <div className="absolute -top-3 left-3 bg-white px-2 text-xs font-medium text-[#6D28D9]">Generated Button Code</div>
                  <pre className="bg-gray-900 text-[#a5b4fc] text-xs p-5 rounded-md overflow-x-auto font-mono min-h-[120px] pt-6 border border-gray-200">
                    {generatedCode}
                  </pre>
                  <button 
                    onClick={() => handleCopy(generatedCode)}
                    disabled={!family || !plan || !currency || !frequency}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors disabled:opacity-30 flex items-center gap-2 text-xs font-medium"
                  >
                    <Copy size={14} /> Copy Code
                  </button>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-gray-900">API Integration Documentation</h3>
              <p className="text-xs text-gray-500">Use our REST API to generate checkout sessions dynamically on your backend.</p>
              
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-700">API Endpoint</div>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded uppercase">Post</span>
                  <span className="text-sm font-mono text-gray-800">/api/v1/checkout/session</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-700">Request Payload</div>
                  <pre className="bg-gray-900 text-[#a5b4fc] text-xs p-4 rounded-md font-mono overflow-x-auto">
{`{
  "product_family": "CRM",
  "plan": "Professional",
  "currency": "USD",
  "frequency": "Monthly",
  "addons": ["API Access"],
  "customer_id": "cust_8a9B2c"
}`}
                  </pre>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-700">Success Response (200 OK)</div>
                  <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-md font-mono overflow-x-auto">
{`{
  "checkout_url": "https://checkout.opz.com/session/123",
  "expires_at": 1718928000,
  "status": "active"
}`}
                  </pre>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="text-xs font-semibold text-gray-700">Sample Implementation (cURL)</div>
                <pre className="bg-gray-800 text-gray-300 text-xs p-4 rounded-md font-mono overflow-x-auto relative group">
{`curl -X POST https://api.opz.com/v1/checkout/session \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "product_family": "CRM", "plan": "Professional" }'`}
                  <button onClick={() => handleCopy('curl...')} className="absolute top-2 right-2 p-1 bg-white/10 hover:bg-white/20 rounded opacity-0 group-hover:opacity-100"><Copy size={12}/></button>
                </pre>
              </div>

            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
