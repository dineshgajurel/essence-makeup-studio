"use client";

import React, { useState, useEffect } from "react";
import { Plus, Wallet, Calendar, Tag, FileText, Trash2, AlertCircle, TrendingDown, Save, X, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

type TimeRange = "today" | "week" | "month" | "custom" | "all";

const EXPENSE_CATEGORIES = [
  "Inventory / Products",
  "Rent",
  "Staff Salaries",
  "Utilities (Elec/Water)",
  "Marketing & Ads",
  "Maintenance",
  "Software / Subs",
  "Taxes",
  "Other"
];

export default function ExpensesManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [customRange, setCustomRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Inventory / Products",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchExpenses();
  }, [timeRange, customRange]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      let query = supabase.from("expenses").select("*").order("date", { ascending: false });

      if (timeRange !== "all") {
        let startDate: string;
        let endDate = new Date().toISOString().split('T')[0];

        if (timeRange === "today") {
          startDate = new Date().toISOString().split('T')[0];
        } else if (timeRange === "week") {
          startDate = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
        } else if (timeRange === "month") {
          startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
        } else {
          // Custom
          startDate = customRange.start;
          endDate = customRange.end;
        }

        query = query.gte("date", startDate).lte("date", endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setExpenses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      setError("Please enter a valid amount.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert([{
          description: formData.description,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date
        }])
        .select();

      if (error) throw error;

      if (data) {
        setExpenses([data[0], ...expenses]);
        setIsAddModalOpen(false);
        setFormData({
          description: "",
          amount: "",
          category: "Inventory / Products",
          date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!confirm("Delete this expense record?")) return;
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-10 max-w-6xl pb-20">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Header & Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">Expenditure</h2>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Track and manage studio outflows</p>
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
                className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  timeRange === range ? "bg-red-500/20 text-red-400 shadow-xl" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-500/20"
          >
            <Plus size={18} />
            RECORD
          </button>
        </div>
      </div>

      {/* Period Summary Card */}
      <div className="bg-gradient-to-r from-red-500/20 via-red-500/5 to-transparent border border-red-500/20 rounded-[40px] p-10 flex justify-between items-center shadow-2xl">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400/70 mb-1">
            {timeRange === "custom" ? `Range: ${customRange.start} to ${customRange.end}` : `Total Outflow (${timeRange})`}
          </p>
          <h4 className="text-4xl font-black text-white tracking-tighter">Rs. {totalExpenses.toLocaleString()}</h4>
        </div>
        <div className="hidden md:flex items-center gap-3 p-6 bg-white/5 rounded-[32px] border border-white/10">
          <TrendingDown size={32} className="text-red-500" />
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase">Records Found</p>
            <p className="text-xl font-black text-white">{expenses.length}</p>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white/5 border border-white/10 rounded-[48px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-600 text-[10px] uppercase font-black tracking-[0.3em]">
                <th className="px-10 py-8">Date</th>
                <th className="px-10 py-8">Description</th>
                <th className="px-10 py-8">Category</th>
                <th className="px-10 py-8">Amount</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-8 text-sm font-bold text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-10 py-8 font-bold text-gray-200">
                    {expense.description}
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-2 rounded-xl bg-white/5 text-gray-500 text-[10px] uppercase font-black tracking-widest border border-white/5">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-10 py-8 font-black text-red-400 text-xl">
                    Rs. {Number(expense.amount).toLocaleString()}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="p-3 hover:bg-red-400/10 rounded-2xl text-gray-700 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center text-gray-600 font-bold uppercase tracking-widest text-xs italic">
                    No records found for this custom period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#050505] border border-white/10 rounded-[56px] p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/30"></div>
              
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter text-white">Record Cost</h3>
                  <p className="text-gray-600 text-sm">Enter the details for your new outflow.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-600 ml-1">What was it for?</label>
                  <div className="relative">
                    <FileText className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                    <input 
                      required
                      type="text" 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="e.g. Electricity Bill - May"
                      className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-16 pr-6 py-5 focus:outline-none focus:border-red-500/50 text-white placeholder:text-gray-800 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-gray-600 ml-1">Amount (Rs.)</label>
                    <div className="relative">
                      <Wallet className="absolute left-6 top-1/2 -translate-y-1/2 text-red-400" size={20} />
                      <input 
                        required
                        type="number" 
                        value={formData.amount}
                        onChange={e => setFormData({...formData, amount: e.target.value})}
                        placeholder="0.00"
                        className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-16 pr-6 py-5 focus:outline-none focus:border-red-500/50 text-white font-black text-xl transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-gray-600 ml-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-[24px] px-8 py-5 focus:outline-none focus:border-red-500/50 text-white appearance-none font-bold"
                    >
                      {EXPENSE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat} className="bg-black">{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-600 ml-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-16 pr-6 py-5 focus:outline-none focus:border-red-500/50 text-white font-bold"
                    />
                  </div>
                </div>

                <button 
                  disabled={isSaving}
                  className="w-full bg-red-500 text-white font-black py-6 rounded-[28px] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-red-500/20 disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
                >
                  {isSaving ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={20} />
                      POST EXPENSE
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
