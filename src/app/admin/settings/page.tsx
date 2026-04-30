"use client";

import React, { useState } from "react";
import { Save, Phone, MapPin, Clock, Globe, Shield } from "lucide-react";

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Studio Information */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Globe size={24} />
          </div>
          <div>
            <h3 className="text-xl font-medium">Studio Information</h3>
            <p className="text-sm text-gray-500">Control the basic details shown on the website.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Studio Name</label>
            <input 
              type="text" 
              defaultValue="Essence Unisex Studio"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Contact Phone</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                defaultValue="9762116374"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Location Address</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                defaultValue="Ghataghar complex, 3rd floor, Ghataghar, Bhaktapur"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-xl font-medium">Business Hours</h3>
            <p className="text-sm text-gray-500">Update your studio's operating schedule.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Opening Time</label>
            <input 
              type="time" 
              defaultValue="09:00"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Closing Time</label>
            <input 
              type="time" 
              defaultValue="20:00"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-red-400/10 text-red-400">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="text-xl font-medium">Security</h3>
            <p className="text-sm text-gray-500">Manage your admin access and passwords.</p>
          </div>
        </div>
        <button className="text-primary hover:underline font-medium">Change Admin Password</button>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-10 py-4 bg-primary text-black rounded-xl hover:scale-105 active:scale-95 transition-all font-medium disabled:opacity-50 disabled:scale-100"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Save size={20} />
              Save All Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
