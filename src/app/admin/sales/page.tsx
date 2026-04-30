"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Calendar, Tag, CreditCard, Save, History, AlertCircle, ChevronDown, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Sale {
  id: string;
  description: string;
  amount: number;
  type: "single" | "multiple" | "daily";
  category: string;
  payment_method: string;
  created_at: string;
}

type TimeRange = "today" | "week" | "month" | "custom" | "all";

export default function SalesManagement() {
  const [saleType, setSaleType] = useState<"single" | "multiple" | "daily">("single");
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [customRange, setCustomRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [categories, setCategories] = useState<string[]>(["General Service", "Product Sale"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    amount: "",
    category: "General Service",
    description: "",
    payment_method: "cash",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchInitialData();
  }, [timeRange, customRange]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const { data: catData } = await supabase.from("categories").select("name");
      if (catData) {
        setCategories(["General Service", "Product Sale", ...catData.map(c => c.name)]);
      }

      let query = supabase.from("sales").select("*").order("created_at", { ascending: false });

      if (timeRange !== "all") {
        let startDate: string;
        let endDate = new Date().toISOString();

        if (timeRange === "today") {
          startDate = new Date(new Date().setHours(0,0,0,0)).toISOString();
        } else if (timeRange === "week") {
          startDate = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString();
        } else if (timeRange === "month") {
          startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString();
        } else {
          startDate = new Date(customRange.start).toISOString();
          endDate = new Date(new Date(customRange.end).setHours(23,59,59,999)).toISOString();
        }

        query = query.gte("created_at", startDate).lte("created_at", endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setSales(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      setError("Please enter a valid amount.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("sales")
        .insert([{
          amount: parseFloat(formData.amount),
          type: saleType,
          category: formData.category,
          description: formData.description,
          payment_method: formData.payment_method,
          created_at: formData.date
        }])
        .select();

      if (error) throw error;

      if (data) {
        setSales([data[0], ...sales]);
        setFormData({ ...formData, amount: "", description: "" });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const periodTotal = sales.reduce((sum, sale) => sum + Number(sale.amount), 0);

  return (
    <div className="space-y-10 max-w-6xl pb-20">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Entry Section */}
      <div className="bg-white/5 border border-white/10 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 group-hover:bg-primary transition-all duration-700"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tighter">Record Revenue</h2>
          <p className="text-gray-500 text-sm mt-1">Capture every transaction accurately</p>
        </div>

        {/* Triple Toggle - Integrated into Form Flow */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-white/5 p-1.5 rounded-[24px] border border-white/10 backdrop-blur-md shadow-inner">
            {(["single", "multiple", "daily"] as const).map((type) => (
              <button 
                key={type}
                onClick={() => setSaleType(type)}
                className={`px-6 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 min-w-[140px] ${
                  saleType === type 
                    ? "bg-primary text-black shadow-2xl shadow-primary/30 scale-105" 
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {type === "single" && "Single Entry"}
                {type === "multiple" && "Multiple Entries"}
                {type === "daily" && "Daily Summary"}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleRecordSale} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2 lg:col-span-1">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Amount (Rs.)</label>
            <div className="relative">
              <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input 
                required
                type="number" 
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-4 py-4 focus:outline-none focus:border-primary/50 text-white font-black text-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Category</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 text-white font-bold appearance-none"
            >
              {categories.map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Payment</label>
            <select 
              value={formData.payment_method}
              onChange={e => setFormData({...formData, payment_method: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 text-white font-bold appearance-none"
            >
              <option value="cash" className="bg-black">Cash</option>
              <option value="fonepay" className="bg-black">FonePay / QR</option>
              <option value="card" className="bg-black">Card</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Entry Date</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 text-white font-bold"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">
              {saleType === "daily" ? "Summary Description" : "Customer / Service Details"}
            </label>
            <input 
              required
              type="text" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder={saleType === "daily" ? "e.g. Total sales for Monday" : "e.g. Haircut - Rahul"}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 text-white"
            />
          </div>

          <button 
            disabled={isSaving}
            className="lg:col-span-1 bg-primary text-black font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/10 mt-auto h-[58px] uppercase tracking-widest text-[10px]"
          >
            {isSaving ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <><Save size={18} /> POST SALE</>}
          </button>
        </form>
      </div>

      {/* History & Filter Section */}
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl">
              <History size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tighter text-white">Sales Log</h3>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Audit and review records</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {timeRange === "custom" && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10"
              >
                <input 
                  type="date" 
                  value={customRange.start}
                  onChange={e => setCustomRange({...customRange, start: e.target.value})}
                  className="bg-transparent text-[10px] font-black text-white px-3 py-2 outline-none"
                />
                <span className="text-gray-600 text-xs">to</span>
                <input 
                  type="date" 
                  value={customRange.end}
                  onChange={e => setCustomRange({...customRange, end: e.target.value})}
                  className="bg-transparent text-[10px] font-black text-white px-3 py-2 outline-none"
                />
              </motion.div>
            )}

            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
              {(["today", "week", "month", "custom", "all"] as TimeRange[]).map((range) => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    timeRange === range ? "bg-white/10 text-white shadow-xl" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Period Summary Card */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/20 rounded-[40px] p-10 flex justify-between items-center shadow-2xl">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70 mb-1">
              {timeRange === "custom" ? `Range: ${customRange.start} to ${customRange.end}` : `Total for ${timeRange}`}
            </p>
            <h4 className="text-4xl font-black text-white tracking-tighter">Rs. {periodTotal.toLocaleString()}</h4>
          </div>
          <div className="hidden md:block px-8 py-4 bg-white/5 border border-white/10 rounded-[24px] text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {sales.length} Records
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white/5 border border-white/10 rounded-[48px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-600 text-[10px] uppercase font-black tracking-[0.3em]">
                  <th className="px-10 py-8">Date</th>
                  <th className="px-10 py-8">Description</th>
                  <th className="px-10 py-8">Type</th>
                  <th className="px-10 py-8 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-8 text-sm font-bold text-gray-500">
                      {new Date(sale.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-10 py-8">
                      <p className="font-bold text-gray-200">{sale.description}</p>
                      <p className="text-[10px] text-gray-600 uppercase font-black mt-1">Via {sale.payment_method}</p>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest border ${
                        sale.type === "daily" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        sale.type === "multiple" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                        "bg-white/5 text-gray-500 border-white/5"
                      }`}>
                        {sale.type}
                      </span>
                    </td>
                    <td className="px-10 py-8 font-black text-primary text-xl text-right">
                      Rs. {Number(sale.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {sales.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-10 py-32 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">
                      No sales found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
