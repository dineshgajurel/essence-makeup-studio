"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  DollarSign,
  Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Stock", href: "/admin/stock", icon: Package },
  { name: "Sales", href: "/admin/sales", icon: DollarSign },
  { name: "Expenses", href: "/admin/expenses", icon: Wallet },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Handle responsive state
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      // On desktop, keep sidebar open (collapsed or full)
      // On mobile, start closed
      if (desktop) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auth check
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      } else {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [pathname, router]);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isDesktop]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-primary">
        <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex text-white font-main relative">
      
      {/* 1. MOBILE DRAWER OVERLAY */}
      <AnimatePresence>
        {isSidebarOpen && !isDesktop && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 2. SIDEBAR */}
      <aside 
        className={`fixed top-0 left-0 h-full z-[110] transition-all duration-500 ease-in-out border-r border-white/10 bg-black flex flex-col 
          ${isDesktop 
            ? (isSidebarOpen ? "w-72" : "w-24") 
            : (isSidebarOpen ? "w-72 translate-x-0 shadow-2xl" : "w-72 -translate-x-full")
          } 
          lg:relative lg:translate-x-0
          ${isDesktop ? "overflow-visible" : "overflow-hidden"}
        `}
      >
        {/* Logo Area */}
        <div className="h-24 flex items-center justify-center px-6 relative shrink-0">
          <span className="text-xl font-black tracking-tighter text-primary whitespace-nowrap">
            {isSidebarOpen ? "ESSENCE ADMIN" : "E"}
          </span>
          {!isDesktop && (
            <button onClick={() => setIsSidebarOpen(false)} className="absolute right-6 p-2 text-gray-500 hover:text-white">
              <X size={24} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 px-3 space-y-2 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative
                  ${isActive 
                    ? "bg-primary text-black shadow-xl shadow-primary/20" 
                    : "text-gray-500 hover:bg-white/5 hover:text-white"
                  } 
                  ${!isSidebarOpen && isDesktop ? "justify-center" : "justify-start"}
                `}
              >
                <item.icon size={22} className={`shrink-0 ${isActive ? "scale-110" : "group-hover:scale-110 transition-transform"}`} />
                
                {isSidebarOpen && (
                  <span className="font-black text-[10px] uppercase tracking-widest whitespace-nowrap overflow-hidden">
                    {item.name}
                  </span>
                )}

                {/* Desktop Floating Tooltip */}
                {!isSidebarOpen && isDesktop && (
                  <div className="absolute left-full ml-4 px-4 py-2 bg-black border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 shadow-2xl z-[120] whitespace-nowrap">
                    {item.name}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-black border-l border-b border-white/10 rotate-45"></div>
                  </div>
                )}

                {isActive && isSidebarOpen && <ChevronRight size={16} className="ml-auto shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-4 px-4 py-4 w-full rounded-2xl text-red-400 hover:bg-red-400/10 transition-all duration-300 group relative
              ${!isSidebarOpen && isDesktop ? "justify-center" : "justify-start"}
            `}
          >
            <LogOut size={22} className="shrink-0" />
            {isSidebarOpen && (
              <span className="font-black text-[10px] uppercase tracking-widest whitespace-nowrap overflow-hidden">Logout</span>
            )}
            
            {/* Desktop Logout Tooltip */}
            {!isSidebarOpen && isDesktop && (
              <div className="absolute left-full ml-4 px-4 py-2 bg-black border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 shadow-2xl z-[120] whitespace-nowrap">
                Logout
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-black border-l border-b border-white/10 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative">
        
        {/* Header */}
        <header className="h-20 border-b border-white/10 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-6 sm:px-10 shrink-0 z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.2em] sm:tracking-[0.3em] truncate max-w-[150px] sm:max-w-none">
              {pathname.split("/").pop() || "Overview"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[8px] sm:text-[10px] font-black uppercase text-gray-500 tracking-widest">Logged in as</span>
              <span className="text-[10px] sm:text-xs font-bold text-primary">Administrator</span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm">
              A
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10 no-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
