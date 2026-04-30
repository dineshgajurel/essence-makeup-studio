"use client";

import React, { useState } from "react";
import { Save, Phone, MapPin, Clock, Globe, Shield, X } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="max-w-4xl space-y-8 md:space-y-12 pb-20">
      <div className="space-y-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white">Settings</h2>
        <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest font-bold">Studio Configuration & Security</p>
      </div>

      {/* Studio Information */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[48px] p-6 sm:p-10 space-y-8 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-primary/10 text-primary">
            <Globe size={28} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-white">Studio Profile</h3>
            <p className="text-xs sm:text-sm text-gray-500">Public identity and contact details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Studio Name</label>
            <input 
              type="text" 
              defaultValue="Essence Unisex Studio"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 text-white font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Contact Phone</label>
            <div className="relative">
              <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
              <input 
                type="text" 
                defaultValue="9762116374"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-primary/50 text-white font-bold"
              />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Location Address</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
              <input 
                type="text" 
                defaultValue="Ghataghar complex, 3rd floor, Ghataghar, Bhaktapur"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-primary/50 text-white font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[48px] p-6 sm:p-10 space-y-8 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-primary/10 text-primary">
            <Clock size={28} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-white">Operations</h3>
            <p className="text-xs sm:text-sm text-gray-500">Operating hours and availability</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Opening Time</label>
            <input 
              type="time" 
              defaultValue="09:00"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 text-white font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Closing Time</label>
            <input 
              type="time" 
              defaultValue="20:00"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 text-white font-bold"
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[48px] p-6 sm:p-10 space-y-8 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-red-400/10 text-red-400">
            <Shield size={28} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-white">Security</h3>
            <p className="text-xs sm:text-sm text-gray-500">Manage administrative access</p>
          </div>
        </div>
        <button className="text-primary hover:underline font-black text-[10px] uppercase tracking-widest">Change Admin Password</button>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-6 bg-primary text-black rounded-2xl md:rounded-3xl hover:scale-105 active:scale-95 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:scale-100"
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
