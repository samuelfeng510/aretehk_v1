'use client';

import { useState, useEffect } from 'react';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    clinicName: 'Aretehk',
    currencySymbol: '$',
    defaultStaffName: 'Dr. Aris Thorne',
    enableNotifications: true,
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
    alert('Settings saved locally! (In a full production app, this would be saved to Firebase)');
    // We could trigger a window reload to apply changes if needed, 
    // or use a context provider for real-time updates.
    window.location.reload();
  };

  return (
    <div className="bg-[#ffffff] p-8 border border-[#dadada] rounded-none font-sans text-[#1a1c1c] max-w-2xl">
      <h2 className="text-2xl font-serif italic text-[#1a1c1c] mb-6">System Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Clinic Name</label>
          <input
            type="text"
            name="clinicName"
            value={settings.clinicName}
            onChange={handleChange}
            className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Currency Symbol</label>
          <input
            type="text"
            name="currencySymbol"
            value={settings.currencySymbol}
            onChange={handleChange}
            className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Default Staff Name</label>
          <input
            type="text"
            name="defaultStaffName"
            value={settings.defaultStaffName}
            onChange={handleChange}
            className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="enableNotifications"
            checked={settings.enableNotifications}
            onChange={handleChange}
            className="h-4 w-4 border-[#c9c6bd] rounded-none text-[#1a1c1c] focus:ring-0"
          />
          <label className="text-sm text-[#48473f]">Enable System Notifications</label>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="w-full bg-[#1a1c1c] text-white p-4 rounded-none font-medium uppercase tracking-widest hover:bg-[#2f3131] transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
