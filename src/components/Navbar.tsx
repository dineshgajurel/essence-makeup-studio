"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-bg-light/98 shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
          : "bg-bg-light/95 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
      } backdrop-blur-md`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center">
          <Link href="#home">
            <Image
              src="/logo.png"
              alt="Essence Logo"
              width={120}
              height={50}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link
              href="#home"
              className="font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary transition-all duration-300 hover:after:w-full"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="#services"
              className="font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary transition-all duration-300 hover:after:w-full"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              href="#about"
              className="font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary transition-all duration-300 hover:after:w-full"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="bg-primary text-text-light px-6 py-3 rounded-full font-medium border-2 border-primary transition-all duration-300 hover:bg-transparent hover:text-primary inline-block"
            >
              Book Now
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <div
          className="md:hidden cursor-pointer flex flex-col gap-1.5 z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={`block w-6 h-0.5 bg-text-dark transition-all duration-300 ${
              isOpen ? "translate-y-2 rotate-45" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-text-dark transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-text-dark transition-all duration-300 ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          ></span>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-bg-light flex flex-col items-center justify-center transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
        >
          <ul className="flex flex-col gap-8 text-center text-xl">
            <li>
              <Link href="#home" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="#services" onClick={() => setIsOpen(false)}>
                Services
              </Link>
            </li>
            <li>
              <Link href="#about" onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="bg-primary text-text-light px-8 py-3 rounded-full font-medium border-2 border-primary"
              >
                Book Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
