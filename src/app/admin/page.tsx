"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Filter,
  Wallet,
  ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type TimeRange = "today" | "week" | "month" | "year" | "all";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [stats, setStats] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    salesCount: 0,
    expenseCount: 0,
    stockWarning: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      let startDate = new Date(0); 

      if (timeRange === "today") {
        startDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (timeRange === "week") {
        startDate = new Date(now.setDate(now.getDate() - 7));
      } else if (timeRange === "month") {
        startDate = new Date(now.setMonth(now.getMonth() - 1));
      } else if (timeRange === "year") {
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      }

      const isoDate = startDate.toISOString();

      const { data: sales } = await supabase
        .from("sales")
        .select("amount")
        .gte("created_at", isoDate);
      
      const totalRevenue = (sales || []).reduce((sum, s) => sum + Number(s.amount), 0);

      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount")
        .gte("date", isoDate.split('T')[0]);
      
      const totalExpenses = (expenses || []).reduce((sum, e) => sum + Number(e.amount), 0);

      const { data: products } = await supabase
        .from("products")
        .select("stock, min_stock_threshold");
      
      const warnings = products?.filter(p => p.stock < (p.min_stock_threshold || 5)).length || 0;

      setStats({
        revenue: totalRevenue,
        expenses: totalExpenses,
        profit: totalRevenue - totalExpenses,
        salesCount: sales?.length || 0,
        expenseCount: expenses?.length || 0,
        stockWarning: warnings
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const mainStats = [
    { 
      name: "Total Revenue", 
      value: `Rs. ${stats.revenue.toLocaleString()}`, 
      icon: ShoppingBag, 
      color: "text-green-400", 
      bg: "bg-green-400/10",
      link: "/admin/sales",
      desc: `${stats.salesCount} transactions`
    },
    { 
      name: "Total Expenses", 
      value: `Rs. ${stats.expenses.toLocaleString()}`, 
      icon: Wallet, 
      color: "text-red-400", 
      bg: "bg-red-400/10",
      link: "/admin/expenses",
      desc: `${stats.expenseCount} records`
    },
    { 
      name: "Net Profit", 
      value: `Rs. ${stats.profit.toLocaleString()}`, 
      icon: DollarSign, 
      color: "text-primary", 
      bg: "bg-primary/10",
      link: "/admin/sales",
      desc: "Profit margin tracking"
    }
  ];

  return (
    <div className="space-y-8 md:space-y-12 pb-20">
      {/* Header & Advanced Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="w-full md:w-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white">Dashboard</h2>
          <p className="text-gray-500 mt-2 text-[10px] sm:text-xs uppercase tracking-widest font-bold">Essence Unisex Studio Analytics</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl w-full md:w-auto overflow-x-auto no-scrollbar">
          {(["today", "week", "month", "all"] as TimeRange[]).map((range) => (
            <button 
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 md:flex-none px-4 sm:px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                timeRange === range ? "bg-primary text-black" : "text-gray-500 hover:text-white"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {mainStats.map((stat, index) => (
          <Link href={stat.link} key={stat.name}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[48px] p-6 sm:p-10 relative overflow-hidden group hover:border-primary/40 hover:bg-white/[0.08] transition-all cursor-pointer h-full"
            >
              <div className={`absolute -right-8 -top-8 w-40 h-40 ${stat.bg} rounded-full blur-3xl group-hover:scale-125 transition-all duration-700`}></div>
              
              <div className="flex justify-between items-center mb-8 sm:mb-10 relative z-10">
                <div className={`p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] ${stat.bg} ${stat.color} shadow-lg shadow-black/20`}>
                  <stat.icon size={24} />
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all">
                  <ChevronRight size={18} />
                </div>
              </div>
              
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">{stat.name}</p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">{stat.value}</h3>
                
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                  <span className={stat.color}>{stat.desc}</span>
                  <span>•</span>
                  <span>{timeRange}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Inventory Health */}
        <Link href="/admin/stock" className="block">
          <div className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[40px] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:bg-white/[0.07] transition-all h-full">
            <div className="flex items-center gap-6">
              <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl ${stats.stockWarning > 0 ? "bg-orange-500/10 text-orange-400" : "bg-green-500/10 text-green-400"}`}>
                <Package size={24} />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white">Stock Status</h4>
                <p className="text-xs sm:text-sm text-gray-500">
                  {stats.stockWarning > 0 
                    ? `${stats.stockWarning} items are low on stock!` 
                    : "All inventory is healthy."}
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest ${
              stats.stockWarning > 0 ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"
            }`}>
              {stats.stockWarning > 0 ? "ACTION REQUIRED" : "OPTIMAL"}
            </div>
          </div>
        </Link>

        {/* Quick Report */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[40px] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:bg-white/[0.07] transition-all h-full">
          <div className="flex items-center gap-6">
            <div className="p-4 sm:p-5 bg-primary/10 text-primary rounded-2xl sm:rounded-3xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-white">Growth Metric</h4>
              <p className="text-xs sm:text-sm text-gray-500">Net profitability is {stats.profit > 0 ? "positive" : "negative"} this period.</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
