"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { ExternalLink, Check, Sparkles, Globe, Zap } from "lucide-react";

export default function Organizations() {
  const { organizations } = portfolioData;

  return (
    <section id="organizations" className="bg-[#0a0a0a]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            My <span className="gradient-text">Organizations</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Leading innovative platforms at the intersection of AI and healthcare
          </p>
        </motion.div>

        <div className="space-y-16">
          {organizations.map((org, index) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-2xl opacity-50" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {org.name === "CiteSort.AI" ? (
                          <Zap className="w-8 h-8 text-yellow-400" />
                        ) : (
                          <Globe className="w-8 h-8 text-blue-400" />
                        )}
                        <h3 className="text-2xl sm:text-3xl font-bold">{org.name}</h3>
                      </div>
                      <p className="text-blue-400 font-medium">{org.role}</p>
                      <p className="text-gray-400 mt-2">{org.description}</p>
                    </div>
                    <a
                      href={org.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all whitespace-nowrap"
                    >
                      Visit Website
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-gray-300 mb-8 leading-relaxed">{org.details}</p>

                  {/* Features Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {org.features.map((feature, fIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: fIndex * 0.05 }}
                        className="flex items-start gap-3 p-4 bg-white/5 rounded-xl"
                      >
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-500/20 rounded-full">
                          <Check className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
