'use client';

import SystemSettings from '../../components/SystemSettings';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header className="border-b border-[#dadada] pb-6">
        <h1 className="text-4xl font-serif italic text-[#1a1c1c]">Settings</h1>

        <p className="text-xs uppercase tracking-widest text-[#605f54] mt-1">Manage your clinic preferences</p>
      </header>
      
      <div className="flex justify-center mt-10">
        <SystemSettings />
      </div>
    </div>
  );
}
