"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, AlertCircle, ArrowUpRight, ArrowDownRight, Package, Save, X, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  min_stock_threshold: number;
}

export default function StockManagement() {
  const [stock, setStock] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<'IN' | 'OUT'>('IN');
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    min_stock_threshold: "5"
  });

  const [adjustData, setAdjustData] = useState({
    quantity: "1",
    reason: "Purchased new batch"
  });

  useEffect(() => {
    fetchStock();
    fetchCategories();
  }, []);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      if (data) setStock(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from("categories").select("name");
      if (data) setCategories(["All", ...data.map(c => c.name)]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([{
          name: formData.name,
          category: formData.category || "General",
          stock: parseInt(formData.stock),
          price: parseFloat(formData.price),
          min_stock_threshold: parseInt(formData.min_stock_threshold)
        }])
        .select();

      if (error) throw error;

      if (data && parseInt(formData.stock) > 0) {
        await supabase.from("stock_logs").insert([{
          product_id: data[0].id,
          type: 'IN',
          quantity: parseInt(formData.stock),
          reason: "Initial Stock"
        }]);
      }

      setIsAddModalOpen(false);
      fetchStock();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const qty = parseInt(adjustData.quantity);
    const newStock = adjustType === 'IN' 
      ? selectedProduct.stock + qty 
      : selectedProduct.stock - qty;

    if (newStock < 0) {
      alert("Error: Stock cannot be negative!");
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", selectedProduct.id);

      if (updateError) throw updateError;

      await supabase.from("stock_logs").insert([{
        product_id: selectedProduct.id,
        type: adjustType,
        quantity: qty,
        reason: adjustData.reason
      }]);

      setIsAdjustModalOpen(false);
      fetchStock();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openAdjust = (product: Product, type: 'IN' | 'OUT') => {
    setSelectedProduct(product);
    setAdjustType(type);
    setAdjustData({
      quantity: "1",
      reason: type === 'IN' ? "Purchased new batch" : "Used for customer service"
    });
    setIsAdjustModalOpen(true);
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="w-full md:w-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white">Stock</h2>
          <p className="text-gray-500 mt-2 text-[10px] sm:text-xs uppercase tracking-widest font-bold">Inventory & Audit Logs</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto px-8 py-4 bg-primary text-black rounded-2xl md:rounded-3xl hover:scale-105 active:scale-95 transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/20"
        >
          <Plus size={18} className="inline mr-2" />
          Add New Product
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeCategory === cat ? "bg-primary text-black" : "bg-white/5 text-gray-500 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Table Container */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 text-gray-600 text-[10px] uppercase font-black tracking-[0.3em]">
                <th className="px-6 md:px-10 py-8">Product Name</th>
                <th className="px-6 md:px-10 py-8">Category</th>
                <th className="px-6 md:px-10 py-8 text-center">Stock Level</th>
                <th className="px-6 md:px-10 py-8 text-right">Audit Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stock
                .filter(item => activeCategory === "All" || item.category === activeCategory)
                .map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 md:px-10 py-8">
                    <p className="font-bold text-gray-200 text-base md:text-lg">{item.name}</p>
                    <p className="text-[10px] text-gray-600 uppercase font-black mt-1">Min Threshold: {item.min_stock_threshold}</p>
                  </td>
                  <td className="px-6 md:px-10 py-8">
                    <span className="px-3 py-1 rounded-lg bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest border border-white/5">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 md:px-10 py-8 text-center">
                    <div className={`text-xl md:text-2xl font-black ${item.stock < item.min_stock_threshold ? "text-red-400" : "text-white"}`}>
                      {item.stock}
                    </div>
                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Units</div>
                  </td>
                  <td className="px-6 md:px-10 py-8 text-right">
                    <div className="flex justify-end gap-2 md:gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => openAdjust(item, 'IN')}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20 hover:bg-green-500/20 transition-all font-black text-[9px] md:text-[10px] uppercase tracking-widest whitespace-nowrap"
                      >
                        <Plus size={14} /> <span className="hidden sm:inline">Stock In</span>
                      </button>
                      <button 
                        onClick={() => openAdjust(item, 'OUT')}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all font-black text-[9px] md:text-[10px] uppercase tracking-widest whitespace-nowrap"
                      >
                        <Trash2 size={14} /> <span className="hidden sm:inline">Stock Out</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      <AnimatePresence>
        {isAdjustModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#050505] border border-white/10 rounded-[32px] sm:rounded-[56px] p-8 sm:p-12 shadow-2xl relative overflow-hidden my-auto"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${adjustType === 'IN' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              
              <div className="flex justify-between items-center mb-8 sm:mb-10">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">Stock {adjustType}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">{selectedProduct?.name}</p>
                </div>
                <button onClick={() => setIsAdjustModalOpen(false)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAdjustStock} className="space-y-6 sm:space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Quantity</label>
                  <input 
                    required
                    type="number" 
                    value={adjustData.quantity}
                    onChange={e => setAdjustData({...adjustData, quantity: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-[18px] sm:rounded-[24px] px-6 sm:px-8 py-4 sm:py-5 focus:outline-none focus:border-primary/50 text-white font-black text-xl sm:text-2xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Reason for Adjustment</label>
                  <input 
                    required
                    type="text" 
                    value={adjustData.reason}
                    onChange={e => setAdjustData({...adjustData, reason: e.target.value})}
                    placeholder="e.g. Purchased new stock"
                    className="w-full bg-white/5 border border-white/10 rounded-[18px] sm:rounded-[24px] px-6 sm:px-8 py-4 sm:py-5 focus:outline-none focus:border-primary/50 text-white placeholder:text-gray-800 text-sm sm:text-base"
                  />
                </div>

                <button 
                  className={`w-full py-5 sm:py-6 rounded-[20px] sm:rounded-[28px] font-black uppercase tracking-[0.2em] text-xs sm:text-sm transition-all shadow-2xl ${
                    adjustType === 'IN' 
                      ? 'bg-green-500 text-white shadow-green-500/10' 
                      : 'bg-red-500 text-white shadow-red-500/10'
                  }`}
                >
                  Confirm {adjustType}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-xl overflow-y-auto">
             <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[32px] sm:rounded-[56px] p-8 sm:p-12 shadow-2xl relative overflow-hidden my-auto"
            >
              <div className="flex justify-between items-center mb-8 sm:mb-10">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">New Product</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Product Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Keratin Shampoo 500ml"
                    className="w-full bg-white/5 border border-white/10 rounded-[18px] sm:rounded-[24px] px-6 sm:px-8 py-4 sm:py-5 focus:outline-none focus:border-primary/50 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Initial Stock</label>
                  <input 
                    required
                    type="number" 
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-[18px] sm:rounded-[24px] px-6 sm:px-8 py-4 sm:py-5 focus:outline-none focus:border-primary/50 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Alert Level</label>
                  <input 
                    required
                    type="number" 
                    value={formData.min_stock_threshold}
                    onChange={e => setFormData({...formData, min_stock_threshold: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-[18px] sm:rounded-[24px] px-6 sm:px-8 py-4 sm:py-5 focus:outline-none focus:border-primary/50 text-white"
                  />
                </div>

                <button 
                  className="sm:col-span-2 bg-primary text-black font-black py-5 sm:py-6 rounded-[20px] sm:rounded-[28px] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 uppercase tracking-[0.2em] text-[10px]"
                >
                  Create Product
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
