import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import UploadCard from './UploadCard';
import ColorPickerSection from './ColorPickerSection';
import EmailPreview from './Previews/EmailPreview';
import InvoicePreview from './Previews/InvoicePreview';
import CheckoutPreview from './Previews/CheckoutPreview';
import PortalPreview from './Previews/PortalPreview';

const TABS = [
  { id: 'email', label: 'Email' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'checkout', label: 'Checkout' },
  { id: 'portal', label: 'Self-Service Portal' }
];

export default function BrandSettingsDashboard() {
  const [activeTab, setActiveTab] = useState('email');
  
  // States
  const [logoUrl, setLogoUrl] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [accentColor, setAccentColor] = useState('#2196F3');
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data (mocking the API call for now)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Mock fetch: const res = await fetch('/api/configure/brand');
        // const data = await res.json();
        // setLogoUrl(data.logoUrl || '');
        // setAccentColor(data.accentColor || '#2196F3');
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    loadSettings();
  }, []);

  // Track unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Mock Save
      // await fetch('/api/configure/brand', { method: 'PUT', body: JSON.stringify({ logoUrl, iconUrl, faviconUrl, accentColor }) });
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      toast.success('Brand settings saved successfully');
      setIsDirty(false);
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const markDirty = () => !isDirty && setIsDirty(true);

  const handleLogoChange = (url) => { setLogoUrl(url); markDirty(); };
  const handleIconChange = (url) => { setIconUrl(url); markDirty(); };
  const handleFaviconChange = (url) => { setFaviconUrl(url); markDirty(); };
  const handleAccentColorChange = (color) => { setAccentColor(color); markDirty(); };

  const renderPreview = () => {
    const props = { logoUrl, accentColor };
    switch (activeTab) {
      case 'email': return <EmailPreview {...props} />;
      case 'invoice': return <InvoicePreview {...props} />;
      case 'checkout': return <CheckoutPreview {...props} />;
      case 'portal': return <PortalPreview {...props} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-full w-full bg-[#F6F4FF] overflow-hidden">
      
      {/* Left Sidebar */}
      <div className="w-[280px] shrink-0 bg-white border-r border-stone-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-stone-100 flex items-center gap-3">
          <button className="text-stone-400 hover:text-stone-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-semibold text-stone-900 text-lg leading-tight">Customize your<br/>brand styles</h2>
        </div>
        
        <nav className="p-4 space-y-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-white border-2 border-purple-600 text-purple-700 shadow-sm' 
                  : 'text-stone-600 hover:bg-stone-50 border-2 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-5xl mx-auto pb-20">
          
          <div className="flex justify-end mb-6">
            <button 
              onClick={handleSave}
              disabled={!isDirty || isLoading}
              className={`px-6 py-2.5 rounded-md font-medium shadow-sm transition-all ${
                isDirty 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-stone-200 text-stone-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-stone-900 mb-2">Upload your global brand identities</h1>
            <p className="text-stone-600">These will appear on your emails, invoices, checkout pages, and customers' self-service portal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <UploadCard 
              label="Logo" 
              recommended="400×300 px or 300×400 px" 
              support="PNG, JPG, SVG"
              fileUrl={logoUrl} 
              onChange={handleLogoChange} 
              onRemove={() => handleLogoChange('')} 
            />
            <UploadCard 
              label="Icon" 
              recommended="300×300 px" 
              fileUrl={iconUrl} 
              onChange={handleIconChange} 
              onRemove={() => handleIconChange('')} 
            />
            <UploadCard 
              label="Favicon" 
              recommended="256×256 px" 
              min="16x16 px"
              support="PNG, ICO"
              fileUrl={faviconUrl} 
              onChange={handleFaviconChange} 
              onRemove={() => handleFaviconChange('')} 
            />
          </div>

          <ColorPickerSection 
            accentColor={accentColor} 
            setAccentColor={handleAccentColorChange} 
          />

          <div className="mt-12">
            <h3 className="text-xl font-bold text-stone-900 mb-6 text-center border-b border-stone-200 pb-4">Live Preview</h3>
            <div className="bg-stone-100 rounded-xl p-8 border border-stone-200 border-dashed min-h-[500px] flex items-center justify-center">
              {renderPreview()}
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
