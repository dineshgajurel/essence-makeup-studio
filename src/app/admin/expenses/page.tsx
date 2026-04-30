"use client";

import React, { useState, useEffect } from "react";
import { Wallet, Calendar, Tag, CreditCard, Save, History, AlertCircle, ChevronDown, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  payment_method: string;
  date: string;
  created_at: string;
}

type TimeRange = "today" | "week" | "month" | "custom" | "all";

export default function ExpensesManagement() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [customRange, setCustomRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>(["Rent", "Electricity", "Supplies", "Marketing", "Staff Salary", "Other"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  
  const [formData, setFormData] = useState({
    amount: "",
    category: "Supplies",
    description: "",
    payment_method: "cash",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchExpenses();
    setCurrentPage(1);
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

  const handleRecordExpense = async (e: React.FormEvent) => {
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
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          payment_method: formData.payment_method,
          date: formData.date
        }])
        .select();

      if (error) throw error;

      if (data) {
        setExpenses([data[0], ...expenses]);
        setFormData({ ...formData, amount: "", description: "" });
        setSuccess("Expense recorded successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const periodTotal = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return (
    <div className="space-y-8 md:space-y-12 max-w-6xl pb-20">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl flex items-center gap-3 text-sm"
        >
          <Save size={18} />
          {success}
        </motion.div>
      )}

      {/* Entry Section */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[48px] p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20 group-hover:bg-red-500 transition-all duration-700"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">Record Expense</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Track your spending meticulously</p>
        </div>

        <form onSubmit={handleRecordExpense} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="space-y-2 lg:col-span-1">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Amount (Rs.)</label>
            <div className="relative">
              <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400" size={20} />
              <input 
                required
                type="number" 
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-4 py-4 focus:outline-none focus:border-red-500/50 text-white font-black text-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Category</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-red-500/50 text-white font-bold appearance-none"
            >
              {categories.map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Payment</label>
            <select 
              value={formData.payment_method}
              onChange={e => setFormData({...formData, payment_method: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-red-500/50 text-white font-bold appearance-none"
            >
              <option value="cash" className="bg-black">Cash</option>
              <option value="fonepay" className="bg-black">FonePay / QR</option>
              <option value="card" className="bg-black">Card</option>
              <option value="bank" className="bg-black">Bank Transfer</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Expense Date</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-red-500/50 text-white font-bold"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Description</label>
            <input 
              required
              type="text" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="e.g. Monthly rent for May"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-red-500/50 text-white"
            />
          </div>

          <button 
            disabled={isSaving}
            className="sm:col-span-2 lg:col-span-1 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5 h-[58px] uppercase tracking-widest text-[10px]"
          >
            {isSaving ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <><Save size={18} /> LOG EXPENSE</>}
          </button>
        </form>
      </div>

      {/* History & Filter Section */}
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 md:gap-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl">
              <History size={24} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-white">Expense Log</h3>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Audit and review spending</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {timeRange === "custom" && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar"
              >
                <input 
                  type="date" 
                  value={customRange.start}
                  onChange={e => setCustomRange({...customRange, start: e.target.value})}
                  className="bg-transparent text-[9px] sm:text-[10px] font-black text-white px-3 py-2 outline-none"
                />
                <span className="text-gray-600 text-[10px]">to</span>
                <input 
                  type="date" 
                  value={customRange.end}
                  onChange={e => setCustomRange({...customRange, end: e.target.value})}
                  className="bg-transparent text-[9px] sm:text-[10px] font-black text-white px-3 py-2 outline-none"
                />
              </motion.div>
            )}

            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
              {(["today", "week", "month", "custom", "all"] as TimeRange[]).map((range) => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    timeRange === range ? "bg-white/10 text-white shadow-xl" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Period Summary Card - Responsive */}
        <div className="bg-gradient-to-r from-red-500/20 via-red-500/5 to-transparent border border-red-500/20 rounded-[32px] md:rounded-[40px] p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-2xl">
          <div>
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-red-400/70 mb-1">
              {timeRange === "custom" ? `Range: ${customRange.start} to ${customRange.end}` : `Total for ${timeRange}`}
            </p>
            <h4 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">Rs. {periodTotal.toLocaleString()}</h4>
          </div>
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {expenses.length} Records
          </div>
        </div>

        {/* Expense Table Container */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-600 text-[10px] uppercase font-black tracking-[0.3em]">
                  <th className="px-6 md:px-10 py-6 md:py-8">Date</th>
                  <th className="px-6 md:px-10 py-6 md:py-8">Description</th>
                  <th className="px-6 md:px-10 py-6 md:py-8">Category</th>
                  <th className="px-6 md:px-10 py-6 md:py-8 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {expenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 md:px-10 py-6 md:py-8 text-sm font-bold text-gray-500 whitespace-nowrap">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 md:px-10 py-6 md:py-8">
                      <p className="font-bold text-gray-200 text-sm md:text-base">{exp.description}</p>
                      <p className="text-[10px] text-gray-600 uppercase font-black mt-1">Via {exp.payment_method}</p>
                    </td>
                    <td className="px-6 md:px-10 py-6 md:py-8">
                      <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] uppercase font-black tracking-widest bg-white/5 text-gray-500 border border-white/5">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-6 md:px-10 py-6 md:py-8 font-black text-red-400 text-lg md:text-xl text-right whitespace-nowrap">
                      Rs. {Number(exp.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-10 py-24 md:py-32 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">
                      No expenses found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {expenses.length > itemsPerPage && (
            <div className="px-6 md:px-10 py-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/[0.02]">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-white">{Math.min(currentPage * itemsPerPage, expenses.length)}</span> of <span className="text-white">{expenses.length}</span> Records
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                  Page {currentPage} of {Math.ceil(expenses.length / itemsPerPage)}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(expenses.length / itemsPerPage), prev + 1))}
                  disabled={currentPage >= Math.ceil(expenses.length / itemsPerPage)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
