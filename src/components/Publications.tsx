"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { FileText, Quote, ExternalLink, BookOpen } from "lucide-react";

export default function Publications() {
  const { publications, socialLinks } = portfolioData;

  return (
    <section id="publications" className="bg-[#0d0d0d]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Publications</span> & Research
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Peer-reviewed systematic reviews and meta-analyses in leading medical journals
          </p>
        </motion.div>

        {/* Publication Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text">69+</div>
            <div className="text-gray-400 text-sm">Total Citations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text">20+</div>
            <div className="text-gray-400 text-sm">Publications</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text">4</div>
            <div className="text-gray-400 text-sm">H-Index</div>
          </div>
        </motion.div>

        {/* Publications List */}
        <div className="space-y-4 mb-12">
          {publications.map((pub, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group p-5 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-500/20 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                    {pub.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="px-2 py-1 bg-white/10 rounded text-gray-300">
                      {pub.journal}
                    </span>
                    <span className="text-gray-500">{pub.year}</span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Quote className="w-3 h-3" />
                      {pub.citations} citations
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href={socialLinks.googleScholar}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            View All on Google Scholar
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Academic Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { name: "ResearchGate", url: socialLinks.researchGate, color: "from-teal-500 to-teal-600" },
            { name: "LinkedIn", url: socialLinks.linkedin, color: "from-blue-600 to-blue-700" },
            { name: "ORCID", url: socialLinks.orcid, color: "from-green-500 to-green-600" },
            { name: "Google Scholar", url: socialLinks.googleScholar, color: "from-blue-400 to-blue-500" },
          ].map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 bg-gradient-to-r ${link.color} rounded-xl text-center font-semibold hover:scale-105 transition-transform`}
            >
              {link.name}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
