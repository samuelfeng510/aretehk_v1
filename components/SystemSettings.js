'use client';

import { useState, useEffect } from 'react';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    clinicName: 'Aretehk',
    clinicLogo: '',
    enableNotifications: true,
    language: 'en',
  });


  useEffect(() => {
    // Load from localStorage if available
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    alert('Settings saved locally!');
    // We could trigger a window reload to apply changes if needed, 
    // or use a context provider for real-time updates.
    window.location.reload();
  };

  return (
    <div className="bg-[#ffffff] p-8 border border-[#dadada] rounded-md font-sans text-[#1a1c1c] max-w-2xl">
      <h2 className="text-2xl font-serif italic text-[#1a1c1c] mb-6">System Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Clinic Name</label>
          <input
            type="text"
            name="clinicName"
            value={settings.clinicName}
            onChange={handleChange}
            className="border border-[#c9c6bd] rounded-md p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Clinic Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border border-[#dadada] flex items-center justify-center bg-[#f9f9f9]">
              {settings.clinicLogo ? (
                <img src={settings.clinicLogo} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-[#79776f]">No Logo</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setSettings({...settings, clinicLogo: reader.result});
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="text-sm text-[#79776f]"
            />
          </div>
        </div>



        <div>
          <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Default Language</label>
          <select
            name="language"
            value={settings.language || 'en'}
            onChange={handleChange}
            className="border border-[#c9c6bd] rounded-md p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"
          >
            <option value="en">English</option>
            <option value="zh">中文 (Chinese)</option>
          </select>
        </div>

        <div className="flex items-center gap-3">

          <input
            type="checkbox"
            name="enableNotifications"
            checked={settings.enableNotifications}
            onChange={handleChange}
            className="h-4 w-4 border-[#c9c6bd] rounded-md text-[#1a1c1c] focus:ring-0"
          />
          <label className="text-sm text-[#48473f]">Enable System Notifications</label>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="w-full bg-[#1a1c1c] text-white p-4 rounded-md font-medium uppercase tracking-widest hover:bg-[#2f3131] transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
