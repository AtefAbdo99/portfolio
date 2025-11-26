"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { Brain, Stethoscope, BookOpen, Code, Award, Users } from "lucide-react";

export default function About() {
  const { personal, skills } = portfolioData;

  const highlights = [
    { icon: Brain, title: "AI & Machine Learning", desc: "Deep learning models for healthcare" },
    { icon: Stethoscope, title: "Clinical Research", desc: "Systematic reviews & meta-analyses" },
    { icon: BookOpen, title: "20+ Publications", desc: "High-impact medical journals" },
    { icon: Code, title: "Healthcare Tech", desc: "Building tools for researchers" },
    { icon: Award, title: "69+ Citations", desc: "Recognized research impact" },
    { icon: Users, title: "Global Collaboration", desc: "International research networks" },
  ];

  return (
    <section id="about" className="bg-[#0d0d0d]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Bridging the gap between clinical expertise and cutting-edge AI technology
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6 gradient-text">My Journey</h3>
            <p className="text-gray-300 leading-relaxed mb-6">{personal.bio}</p>
            <p className="text-gray-400 leading-relaxed mb-8">
              With a strong background in healthcare research and deep learning, I have contributed 
              to high-impact projects that transform clinical data into actionable insights. My work 
              accelerates medical discoveries, drives evidence-based decisions, and improves patient 
              treatment outcomes.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all group"
                >
                  <item.icon className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6 gradient-text">Skills & Expertise</h3>
            <div className="space-y-5">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-blue-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Download CV Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Request Full CV
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
