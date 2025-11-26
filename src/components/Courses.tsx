"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { BookOpen, ExternalLink, Star, GraduationCap, Bookmark, Link2, ArrowRight } from "lucide-react";

export default function Courses() {
  const { aiCourses, recommendedMaterials, contributions } = portfolioData;

  return (
    <section id="courses" className="bg-[#0d0d0d]">
      <div className="section-container">
        {/* AI Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            AI <span className="gradient-text">Courses</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Recommended courses for mastering AI in healthcare
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {aiCourses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-500/20 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  course.level === "Advanced" 
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" 
                    : "bg-green-500/20 text-green-400 border border-green-500/30"
                }`}>
                  {course.level}
                </span>
              </div>
              <h4 className="text-lg font-bold mb-1 group-hover:text-blue-400 transition-colors">
                {course.title}
              </h4>
              <p className="text-sm text-blue-400 mb-3">{course.provider}</p>
              <p className="text-gray-400 text-sm">{course.description}</p>
            </motion.div>
          ))}
        </div>

        {/* View All Courses Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <GraduationCap className="w-5 h-5" />
            View All Courses
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Recommended Materials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold mb-4">
            <Bookmark className="inline w-6 h-6 text-yellow-400 mr-2" />
            Recommended <span className="gradient-text">Materials</span>
          </h3>
          <p className="text-gray-400">Curated resources for healthcare AI professionals</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {recommendedMaterials.map((material, index) => (
            <motion.a
              key={material.title}
              href={material.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-5 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-medium">
                  {material.type}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                {material.title}
              </h4>
              <p className="text-gray-400 text-sm">{material.description}</p>
            </motion.a>
          ))}
        </div>

        {/* Contributions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold mb-4">
            <Star className="inline w-6 h-6 text-yellow-400 mr-2" />
            My <span className="gradient-text">Contributions</span>
          </h3>
          <p className="text-gray-400">Open source projects and community involvement</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {contributions.map((contribution, index) => (
            <motion.div
              key={contribution.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                <Link2 className="w-8 h-8 text-blue-400" />
              </div>
              <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium mb-3">
                {contribution.type}
              </span>
              <h4 className="text-lg font-bold mb-2">{contribution.title}</h4>
              <p className="text-gray-400 text-sm mb-4">{contribution.description}</p>
              <a
                href={contribution.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition-colors"
              >
                Learn More
                <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
