"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);

const TikTokIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
);

const WhatsAppIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { name: "Instagram", href: "https://www.instagram.com/essencemakeupstudio", icon: InstagramIcon },
    { name: "TikTok", href: "https://www.tiktok.com/@essence.makeup.st", icon: TikTokIcon },
    { name: "WhatsApp", href: "https://wa.me/9762116374", icon: WhatsAppIcon },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b ${
        isScrolled 
          ? "py-3 bg-black/80 backdrop-blur-2xl border-white/5 shadow-2xl" 
          : "py-5 bg-black/40 backdrop-blur-sm border-white/10"
      }`}
    >
      <div className="max-w-[1600px] mx-auto flex justify-between items-center px-6 sm:px-12">
        {/* Logo */}
        <Link href="#home" className="relative z-[110] transition-transform duration-500 hover:scale-105">
          <Image
            src="/logo.png"
            alt="Essence Logo"
            width={160}
            height={70}
            className={`transition-all duration-700 w-auto object-contain ${
              isScrolled ? "h-8 sm:h-10" : "h-12 sm:h-16"
            }`}
            priority
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-8 flex-1 justify-end">
          {/* Social Links - Always Visible */}
          <div className="flex items-center gap-3 sm:gap-5 border-r border-white/10 pr-4 sm:pr-8 mr-2 sm:mr-0">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 text-white hover:text-primary hover:scale-110"
                title={social.name}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.name === "Contact" ? (
                  <Link
                    href={link.href}
                    className="rounded-full font-black uppercase tracking-[0.25em] bg-white text-black hover:bg-primary hover:text-black transition-all duration-500 shadow-xl shadow-white/5 active:scale-95 whitespace-nowrap px-10 py-3.5 text-[11px]"
                  >
                    Book Now / Contact
                  </Link>
                ) : (
                  <Link
                    href={link.href}
                    className="font-black uppercase tracking-[0.3em] transition-all duration-300 relative group py-2 text-[12px] text-white hover:text-primary"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full group-hover:h-1"></span>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative z-[110] p-2 text-white hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="fixed inset-0 bg-black z-[105] flex flex-col h-[100dvh] w-screen overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-10 relative z-10">
                <ul className="flex flex-col gap-8 text-center w-full">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                      className="w-full"
                    >
                      {link.name === "Contact" ? (
                        <div className="flex flex-col items-center gap-10 mt-6">
                          <Link
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="bg-primary text-black px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.4em] inline-block shadow-2xl shadow-primary/20 w-full max-w-[300px]"
                          >
                            Book Now / Contact
                          </Link>

                          {/* Social Links Mobile */}
                          <div className="flex items-center gap-8">
                            {socialLinks.map((social, si) => (
                              <motion.a
                                key={social.name}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + si * 0.1 }}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary transition-all duration-500"
                              >
                                <social.icon size={22} />
                              </motion.a>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="text-3xl font-black uppercase tracking-[0.5em] text-white hover:text-primary transition-all duration-500 block py-2"
                        >
                          {link.name}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="p-10 text-center relative z-10 border-t border-white/5 bg-black/50 backdrop-blur-md">
                <div className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-500">
                  ESSENCE UNISEX STUDIO
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
