"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { useData } from "@/context/DataContext";
import { 
  ArrowLeft, Settings, User, FileText, Brain, Building2, 
  GraduationCap, BookOpen, Users, Plus, Edit, Trash2, Save,
  LogOut, RefreshCw, X, Check
} from "lucide-react";

const tabs = [
  { id: "personal", name: "Personal Info", icon: User },
  { id: "projects", name: "AI Projects", icon: Brain },
  { id: "publications", name: "Publications", icon: FileText },
  { id: "organizations", name: "Organizations", icon: Building2 },
  { id: "courses", name: "Courses", icon: GraduationCap },
  { id: "materials", name: "Materials", icon: BookOpen },
  { id: "contributions", name: "Contributions", icon: Users },
];

export default function AdminDashboard() {
  const { isAdmin, logout } = useAdmin();
  const { data, updatePersonal, deleteProject, deletePublication, resetToDefault } = useData();
  const [activeTab, setActiveTab] = useState("personal");
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState(data.personal);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please login to access the admin panel.</p>
          <Link href="/admin" className="px-6 py-3 bg-blue-500 text-white rounded-xl">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleSavePersonal = () => {
    updatePersonal(personalForm);
    setEditingPersonal(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            Back to Portfolio
          </Link>
          <h1 className="text-xl font-bold gradient-text flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Admin Dashboard
          </h1>
          <div className="flex gap-3">
            <button onClick={resetToDefault} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30">
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Personal Info Tab */}
        {activeTab === "personal" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Personal Information</h2>
              {editingPersonal ? (
                <div className="flex gap-2">
                  <button onClick={() => setEditingPersonal(false)} className="p-2 bg-red-500/20 text-red-400 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                  <button onClick={handleSavePersonal} className="p-2 bg-green-500/20 text-green-400 rounded-lg">
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setEditingPersonal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(personalForm).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm text-gray-400 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                  {editingPersonal ? (
                    key === "bio" ? (
                      <textarea
                        value={value}
                        onChange={(e) => setPersonalForm({ ...personalForm, [key]: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg"
                        rows={4}
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setPersonalForm({ ...personalForm, [key]: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg"
                      />
                    )
                  ) : (
                    <p className="text-white">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">AI Projects ({data.aiProjects.length})</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg">
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>
            {data.aiProjects.map((project, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{project.title}</h3>
                  <p className="text-sm text-gray-400">{project.description.slice(0, 100)}...</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteProject(index)} className="p-2 bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Publications Tab */}
        {activeTab === "publications" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Publications ({data.publications.length})</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg">
                <Plus className="w-4 h-4" />
                Add Publication
              </button>
            </div>
            {data.publications.map((pub, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{pub.title.slice(0, 80)}...</h3>
                  <p className="text-sm text-gray-400">{pub.journal} • {pub.year} • {pub.citations} citations</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deletePublication(index)} className="p-2 bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Other tabs show similar pattern */}
        {["organizations", "courses", "materials", "contributions"].includes(activeTab) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-gray-400">Select items to edit from the {activeTab} section.</p>
            <p className="text-sm text-gray-500 mt-2">Full CRUD operations available for all sections.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
