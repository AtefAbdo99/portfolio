"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Publications", href: "#publications" },
  { name: "Organizations", href: "#organizations" },
  { name: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-lg shadow-lg border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.a
            href="#home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold gradient-text"
          >
            Dr. Atef Hassan
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {item.name}
              </motion.a>
            ))}
            <Link
              href="/courses"
              className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              Courses
            </Link>
            {isAdmin ? (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            ) : (
              <Link
                href="/admin"
                className="p-2 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-all"
                title="Admin Login"
              >
                <Settings className="w-4 h-4" />
              </Link>
            )}
            <motion.a
              href="#hire"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="ml-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              Hire Me
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  {item.name}
                </a>
              ))}
              <Link
                href="/courses"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                Courses
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Admin Login
                </Link>
              )}
              <a
                href="#hire"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg mt-4"
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
