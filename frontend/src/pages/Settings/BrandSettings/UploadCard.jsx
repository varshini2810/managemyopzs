import React, { useRef } from 'react';
import { UploadCloud, X, RefreshCw } from 'lucide-react';

export default function UploadCard({ label, recommended, min, support, fileUrl, onChange, onRemove }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload it to the server here and get the URL.
      // For this implementation, we will use a local object URL to simulate the upload
      // to keep it client-side without relying on immediate backend support.
      const url = URL.createObjectURL(file);
      onChange(url, file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
      <div className="font-medium text-sm text-stone-800 mb-1">{label}</div>
      {recommended && <div className="text-xs text-stone-500 mb-4">Recommended: {recommended}</div>}
      {min && <div className="text-xs text-stone-500 mb-4">Minimum: {min}</div>}
      {support && <div className="text-xs text-stone-500 mb-4">Support: {support}</div>}

      <div 
        className="w-full h-32 border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center bg-stone-50 cursor-pointer hover:bg-stone-100 transition-colors relative"
        onClick={!fileUrl ? handleClick : undefined}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/png, image/jpeg, image/svg+xml, image/x-icon" 
        />
        
        {fileUrl ? (
          <div className="relative w-full h-full p-2 flex items-center justify-center group">
            <img src={fileUrl} alt={label} className="max-w-full max-h-full object-contain" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); handleClick(); }} 
                className="p-1.5 bg-white rounded text-stone-700 hover:text-stone-900 shadow"
                title="Replace"
              >
                <RefreshCw size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onRemove(); }} 
                className="p-1.5 bg-white rounded text-red-600 hover:text-red-700 shadow"
                title="Delete"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <UploadCloud className="text-stone-400 mb-2" size={24} />
            <div className="text-sm font-medium text-purple-600">Click to Upload</div>
            <div className="text-xs text-stone-500 mt-1">or Drag & Drop</div>
          </>
        )}
      </div>
    </div>
  );
}
