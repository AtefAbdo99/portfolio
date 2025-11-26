"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { Heart, ArrowUp, Stethoscope } from "lucide-react";

export default function Footer() {
  const { personal, socialLinks } = portfolioData;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold gradient-text">Dr. Atef Hassan</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {personal.subtitle}. Bridging clinical expertise with cutting-edge AI technology 
              to advance healthcare worldwide.
            </p>
            <div className="flex gap-3">
              {[
                { name: "RG", url: socialLinks.researchGate },
                { name: "in", url: socialLinks.linkedin },
                { name: "ID", url: socialLinks.orcid },
                { name: "GS", url: socialLinks.googleScholar },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-blue-500/30 rounded-lg text-xs font-bold transition-all"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["About", "Projects", "Publications", "Organizations"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Organizations */}
          <div>
            <h4 className="font-bold mb-4">Organizations</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://citesort.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  CiteSort.AI
                </a>
              </li>
              <li>
                <a
                  href="https://orthoglobe.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  OrthoGlobe
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} Dr. Atef Abdelrahman Hassan. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> for Healthcare AI
          </div>
        </div>

        {/* Back to Top */}
        <motion.a
          href="#home"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="fixed bottom-8 right-8 w-12 h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg shadow-blue-500/30 transition-all z-50"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.a>
      </div>
    </footer>
  );
}
