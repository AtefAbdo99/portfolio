"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  GraduationCap, 
  ArrowLeft, 
  Brain, 
  Stethoscope, 
  Code, 
  Database, 
  ImageIcon, 
  MessageSquare,
  ExternalLink,
  Clock,
  Star,
  Filter,
  BookOpen
} from "lucide-react";

// Extended course data with categories
const coursesData = {
  categories: [
    { id: "all", name: "All Courses", icon: BookOpen },
    { id: "deep-learning", name: "Deep Learning", icon: Brain },
    { id: "medical-imaging", name: "Medical Imaging", icon: ImageIcon },
    { id: "clinical-ai", name: "Clinical AI", icon: Stethoscope },
    { id: "nlp", name: "NLP in Healthcare", icon: MessageSquare },
    { id: "data-science", name: "Data Science", icon: Database },
    { id: "programming", name: "Programming", icon: Code },
  ],
  courses: [
    // Deep Learning
    {
      id: 1,
      title: "Deep Learning Specialization",
      provider: "DeepLearning.AI / Coursera",
      instructor: "Andrew Ng",
      category: "deep-learning",
      level: "Intermediate",
      duration: "5 months",
      rating: 4.9,
      description: "Master deep learning fundamentals, including neural networks, CNNs, RNNs, and sequence models.",
      link: "https://www.coursera.org/specializations/deep-learning",
      skills: ["Neural Networks", "CNN", "RNN", "TensorFlow"],
      featured: true,
    },
    {
      id: 2,
      title: "Deep Learning for Medical Imaging",
      provider: "Coursera / Stanford",
      instructor: "Stanford AI Lab",
      category: "medical-imaging",
      level: "Advanced",
      duration: "3 months",
      rating: 4.8,
      description: "Comprehensive course covering CNN architectures for medical image analysis, including X-ray, CT, and MRI interpretation.",
      link: "https://www.coursera.org/",
      skills: ["Medical Imaging", "CNN", "Radiology AI", "Diagnostics"],
      featured: true,
    },
    {
      id: 3,
      title: "AI for Medical Diagnosis",
      provider: "DeepLearning.AI",
      instructor: "Pranav Rajpurkar",
      category: "clinical-ai",
      level: "Advanced",
      duration: "1 month",
      rating: 4.7,
      description: "Build AI models for medical diagnosis including chest X-ray analysis and brain tumor detection.",
      link: "https://www.coursera.org/learn/ai-for-medical-diagnosis",
      skills: ["Chest X-ray AI", "Tumor Detection", "Model Evaluation"],
      featured: true,
    },
    {
      id: 4,
      title: "Machine Learning in Healthcare",
      provider: "MIT OpenCourseWare",
      instructor: "MIT Faculty",
      category: "clinical-ai",
      level: "Intermediate",
      duration: "4 months",
      rating: 4.8,
      description: "Clinical machine learning applications including risk prediction, diagnosis support, and treatment optimization.",
      link: "https://ocw.mit.edu/",
      skills: ["Clinical ML", "Risk Prediction", "EHR Analysis"],
      featured: false,
    },
    {
      id: 5,
      title: "Natural Language Processing in Healthcare",
      provider: "Google Cloud",
      instructor: "Google Health Team",
      category: "nlp",
      level: "Intermediate",
      duration: "2 months",
      rating: 4.6,
      description: "NLP techniques for clinical text mining, medical record analysis, and literature synthesis.",
      link: "https://cloud.google.com/training",
      skills: ["Clinical NLP", "Text Mining", "BERT for Healthcare"],
      featured: false,
    },
    {
      id: 6,
      title: "Medical Image Segmentation",
      provider: "Udacity",
      instructor: "AI Healthcare Team",
      category: "medical-imaging",
      level: "Advanced",
      duration: "2 months",
      rating: 4.5,
      description: "Learn U-Net, nnU-Net, and transformer architectures for precise medical image segmentation.",
      link: "https://www.udacity.com/",
      skills: ["U-Net", "Segmentation", "Organ Detection"],
      featured: false,
    },
    {
      id: 7,
      title: "Python for Data Science and AI",
      provider: "IBM / Coursera",
      instructor: "IBM Skills Network",
      category: "programming",
      level: "Beginner",
      duration: "5 weeks",
      rating: 4.6,
      description: "Foundation course for Python programming with focus on data science and AI applications.",
      link: "https://www.coursera.org/learn/python-for-applied-data-science-ai",
      skills: ["Python", "Pandas", "NumPy", "Data Visualization"],
      featured: false,
    },
    {
      id: 8,
      title: "TensorFlow for Healthcare",
      provider: "TensorFlow",
      instructor: "Google Brain Team",
      category: "programming",
      level: "Intermediate",
      duration: "6 weeks",
      rating: 4.7,
      description: "Build production-ready healthcare AI models using TensorFlow and Keras.",
      link: "https://www.tensorflow.org/tutorials",
      skills: ["TensorFlow", "Keras", "Model Deployment"],
      featured: false,
    },
    {
      id: 9,
      title: "Clinical Data Science",
      provider: "Harvard Online",
      instructor: "Harvard Medical School",
      category: "data-science",
      level: "Intermediate",
      duration: "3 months",
      rating: 4.8,
      description: "Learn to analyze clinical datasets, EHRs, and conduct healthcare analytics research.",
      link: "https://online-learning.harvard.edu/",
      skills: ["Clinical Analytics", "EHR Analysis", "Biostatistics"],
      featured: true,
    },
    {
      id: 10,
      title: "AI for Drug Discovery",
      provider: "MIT",
      instructor: "MIT CSAIL",
      category: "clinical-ai",
      level: "Advanced",
      duration: "3 months",
      rating: 4.7,
      description: "Apply machine learning to drug discovery, molecular design, and pharmaceutical research.",
      link: "https://www.mit.edu/",
      skills: ["Drug Discovery", "Molecular ML", "Protein Folding"],
      featured: false,
    },
    {
      id: 11,
      title: "Systematic Review Methodology",
      provider: "Cochrane Training",
      instructor: "Cochrane Collaboration",
      category: "data-science",
      level: "Intermediate",
      duration: "4 weeks",
      rating: 4.9,
      description: "Master the gold standard methodology for conducting systematic reviews and meta-analyses.",
      link: "https://training.cochrane.org/",
      skills: ["PRISMA", "Meta-Analysis", "Evidence Synthesis"],
      featured: true,
    },
    {
      id: 12,
      title: "Radiology AI with PyTorch",
      provider: "Fast.ai",
      instructor: "Jeremy Howard",
      category: "medical-imaging",
      level: "Intermediate",
      duration: "7 weeks",
      rating: 4.8,
      description: "Practical deep learning for radiology using PyTorch and fast.ai library.",
      link: "https://www.fast.ai/",
      skills: ["PyTorch", "Radiology AI", "Transfer Learning"],
      featured: false,
    },
  ],
};

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const filteredCourses = coursesData.courses.filter((course) => {
    const categoryMatch = selectedCategory === "all" || course.category === selectedCategory;
    const levelMatch = selectedLevel === "all" || course.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const featuredCourses = coursesData.courses.filter((c) => c.featured);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Portfolio
          </Link>
          <h1 className="text-xl font-bold gradient-text">AI Courses</h1>
          <div className="w-24" />
        </div>
      </header>

      <div className="section-container">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-blue-500/20 rounded-2xl">
            <GraduationCap className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            AI & Healthcare <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Curated collection of the best courses for mastering AI in healthcare, 
            from fundamentals to advanced clinical applications.
          </p>
        </motion.div>

        {/* Featured Courses */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            Featured Courses
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <motion.a
                key={course.id}
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="group p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                    Featured
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    {course.rating}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-blue-400 text-sm mb-2">{course.provider}</p>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    course.level === "Advanced" 
                      ? "bg-purple-500/20 text-purple-400" 
                      : course.level === "Intermediate"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-green-500/20 text-green-400"
                  }`}>
                    {course.level}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
            {coursesData.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {["all", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedLevel === level
                    ? "bg-cyan-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {level === "all" ? "All Levels" : level}
              </button>
            ))}
          </div>
        </motion.div>

        {/* All Courses Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6">
            All Courses ({filteredCourses.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.a
                key={course.id}
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="group p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    course.level === "Advanced" 
                      ? "bg-purple-500/20 text-purple-400" 
                      : course.level === "Intermediate"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-green-500/20 text-green-400"
                  }`}>
                    {course.level}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    {course.rating}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-blue-400 text-sm mb-1">{course.provider}</p>
                <p className="text-gray-500 text-xs mb-3">by {course.instructor}</p>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1 text-blue-400 group-hover:text-blue-300">
                    View Course
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No courses found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
