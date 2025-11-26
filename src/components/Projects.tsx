"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { portfolioData } from "@/lib/data";
import { Play, Pause, Cpu, Sparkles, Maximize2, Brain, Zap, Database, Mic, FileText, ArrowRight, Rocket, FlaskConical } from "lucide-react";

export default function Projects() {
  const { aiProjects, newProjects } = portfolioData;
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  return (
    <section id="projects" className="bg-[#0a0a0a]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            AI <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Innovative healthcare AI solutions powered by deep learning and computer vision
          </p>
        </motion.div>

        {/* Featured Beta Project - MedResearch AI Lab */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Link href="/medresearch-ai">
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-cyan-900/50 border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer group"
            >
              {/* Animated background effects */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-conic from-purple-500/20 via-transparent to-cyan-500/20"
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                />
                <motion.div 
                  animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
                />
              </div>

              <div className="relative p-8 md:p-12">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  {/* Left: Icon and Badge */}
                  <div className="flex-shrink-0">
                    <motion.div 
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="relative"
                    >
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                        <FlaskConical className="w-16 h-16 text-white" />
                      </div>
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-black"
                      >
                        🚀 BETA
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Center: Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-4"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300">New AI-Powered Research Tool</span>
                    </motion.div>
                    
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                      MedResearch AI Lab
                    </h3>
                    
                    <p className="text-gray-300 text-lg mb-6 max-w-2xl">
                      Revolutionary AI research assistant powered by <span className="text-cyan-400 font-semibold">Grok 4.1</span> with 
                      RAG-enhanced responses, real-time academic database search, voice interaction, and 8+ specialized research tools.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                      {[
                        { icon: Brain, text: "RAG Enhanced", color: "from-purple-500 to-pink-500" },
                        { icon: Database, text: "5 Databases", color: "from-blue-500 to-cyan-500" },
                        { icon: Mic, text: "Voice Input", color: "from-green-500 to-emerald-500" },
                        { icon: FileText, text: "8 Tools", color: "from-orange-500 to-red-500" },
                        { icon: Zap, text: "Real-time", color: "from-yellow-500 to-orange-500" },
                      ].map((feature, i) => (
                        <motion.div
                          key={feature.text}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${feature.color} bg-opacity-20 border border-white/10`}
                        >
                          <feature.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{feature.text}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all"
                    >
                      <Rocket className="w-5 h-5" />
                      Launch AI Lab
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </div>

                  {/* Right: Floating elements */}
                  <div className="hidden xl:flex flex-col gap-4">
                    {["PubMed", "Semantic Scholar", "CrossRef", "ClinicalTrials"].map((db, i) => (
                      <motion.div
                        key={db}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-sm border border-white/20"
                      >
                        {db}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* AI Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {aiProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all"
            >
              {/* Video Preview */}
              <div className="relative aspect-video bg-black/50 overflow-hidden">
                <video
                  id={`video-${project.title}`}
                  src={project.video}
                  className="w-full h-full object-cover transition-opacity"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />
                
                {/* Play/Pause Button */}
                <button
                  onClick={() => {
                    const video = document.getElementById(`video-${project.title}`) as HTMLVideoElement;
                    if (video) {
                      if (playingVideo === project.title) {
                        video.pause();
                        setPlayingVideo(null);
                      } else {
                        // Pause other videos
                        document.querySelectorAll('video').forEach(v => v.pause());
                        video.play();
                        setPlayingVideo(project.title);
                      }
                    }
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-all cursor-pointer"
                >
                  <div className={`w-16 h-16 flex items-center justify-center rounded-full transition-all ${
                    playingVideo === project.title 
                      ? "bg-red-500/80 hover:bg-red-600/80" 
                      : "bg-blue-500/80 hover:bg-blue-600/80"
                  }`}>
                    {playingVideo === project.title ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </div>
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={() => {
                    const video = document.getElementById(`video-${project.title}`) as HTMLVideoElement;
                    if (video) {
                      video.requestFullscreen();
                    }
                  }}
                  className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-all z-10"
                >
                  <Maximize2 className="w-4 h-4 text-white" />
                </button>

                <span className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400">
                  {project.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <Cpu className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold mb-4">
            <Sparkles className="inline w-6 h-6 text-yellow-400 mr-2" />
            Coming <span className="gradient-text">Soon</span>
          </h3>
          <p className="text-gray-400">New projects currently in development</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {newProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 border-dashed"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-400">
                  {project.status}
                </span>
                <span className="text-xs text-gray-500">ETA: {project.eta}</span>
              </div>
              <h4 className="text-lg font-bold mb-2">{project.title}</h4>
              <p className="text-gray-400 text-sm">{project.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
