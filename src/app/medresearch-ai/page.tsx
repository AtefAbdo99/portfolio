"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Send, Bot, User, Search, FileText, Lightbulb, BookOpen, Loader2, Copy, Check, Trash2, Upload, X, FileCode, Image as ImageIcon, File, Table, Microscope, FlaskConical, GraduationCap, Download, Globe, Database, ExternalLink, Beaker, Library, Sparkles, Brain, Zap, Activity, Mic, MicOff, Calculator, Quote, GitBranch, BarChart3, FileSearch, Wand2, Play, Volume2 } from "lucide-react";

interface Message { id: string; role: "user" | "assistant"; content: string; timestamp: Date; files?: UploadedFile[]; searchResults?: SearchResults; ragEnabled?: boolean; ragSources?: string[]; ragFactCount?: number; media?: { videos: string[] }; }
interface UploadedFile { name: string; type: string; size: number; content: string; preview?: string; }
interface SearchResults { source: string; query: string; results: any[]; totalCount: number; }

// Extract YouTube videos from text
const extractYouTubeVideos = (text: string): string[] => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/g;
  const videos: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (!videos.includes(match[1])) videos.push(match[1]);
  }
  return videos;
};

// Thinking animation phrases
const thinkingPhrases = [
  { text: "Analyzing query...", icon: Brain },
  { text: "Searching databases...", icon: Database },
  { text: "Processing information...", icon: Zap },
  { text: "Synthesizing results...", icon: Sparkles },
  { text: "Generating insights...", icon: Lightbulb },
  { text: "Formulating response...", icon: Activity },
];

const modes = [
  { id: "general", name: "Research", icon: Microscope, color: "from-blue-500 to-cyan-500" },
  { id: "research-ideas", name: "Ideas", icon: Lightbulb, color: "from-yellow-500 to-orange-500" },
  { id: "systematic-review", name: "Review", icon: BookOpen, color: "from-green-500 to-emerald-500" },
  { id: "literature-search", name: "Search", icon: Search, color: "from-purple-500 to-pink-500" },
  { id: "manuscript-help", name: "Writing", icon: FileText, color: "from-red-500 to-rose-500" },
  { id: "statistics", name: "Stats", icon: Table, color: "from-indigo-500 to-violet-500" },
];

const searchDbs = [
  { id: "pubmed", name: "PubMed", icon: Database, color: "bg-blue-500" },
  { id: "scholar", name: "Scholar", icon: GraduationCap, color: "bg-purple-500" },
  { id: "crossref", name: "CrossRef", icon: Library, color: "bg-green-500" },
  { id: "trials", name: "Trials", icon: Beaker, color: "bg-orange-500" },
  { id: "web", name: "Web", icon: Globe, color: "bg-gray-500" },
];

// Quick research tools - Extended
const quickTools = [
  { id: "prisma", name: "PRISMA Generator", icon: GitBranch, prompt: "Generate a complete PRISMA 2020 flow diagram description with all required items and checklist for a systematic review about: ", color: "from-green-500 to-emerald-500" },
  { id: "pico", name: "PICO Framework", icon: Table, prompt: "Create a detailed PICO/PICOS framework with specific elements for a research question about: ", color: "from-blue-500 to-cyan-500" },
  { id: "citation", name: "Citation Generator", icon: Quote, prompt: "Generate proper academic citations in APA, AMA, Vancouver, and Harvard formats for the following study: ", color: "from-purple-500 to-pink-500" },
  { id: "sample", name: "Sample Size Calculator", icon: Calculator, prompt: "Calculate the required sample size with power analysis for a study with the following parameters: ", color: "from-orange-500 to-red-500" },
  { id: "bias", name: "Bias Assessment", icon: FileSearch, prompt: "Provide a comprehensive risk of bias assessment using appropriate tools (ROB 2, ROBINS-I, or Newcastle-Ottawa) for: ", color: "from-yellow-500 to-orange-500" },
  { id: "abstract", name: "Abstract Writer", icon: FileText, prompt: "Write a structured abstract (Background, Methods, Results, Conclusion) for a research paper about: ", color: "from-indigo-500 to-purple-500" },
  { id: "stats", name: "Statistical Analysis", icon: BarChart3, prompt: "Recommend the appropriate statistical tests and analysis plan for a study with: ", color: "from-cyan-500 to-blue-500" },
  { id: "protocol", name: "Study Protocol", icon: BookOpen, prompt: "Generate a complete study protocol template following SPIRIT or CONSORT guidelines for: ", color: "from-rose-500 to-pink-500" },
  { id: "mesh", name: "MeSH Terms", icon: Search, prompt: "Generate comprehensive MeSH terms and search keywords for a literature search about: ", color: "from-teal-500 to-cyan-500" },
  { id: "grade", name: "GRADE Assessment", icon: BarChart3, prompt: "Perform a GRADE (Grading of Recommendations Assessment) evidence quality assessment for: ", color: "from-amber-500 to-yellow-500" },
  { id: "meta", name: "Meta-Analysis Plan", icon: Activity, prompt: "Create a detailed meta-analysis methodology plan including heterogeneity assessment, subgroup analysis, and forest plot description for: ", color: "from-violet-500 to-purple-500" },
  { id: "reviewer", name: "Reviewer Response", icon: FileText, prompt: "Draft professional point-by-point responses to peer reviewer comments for: ", color: "from-pink-500 to-rose-500" },
];

const MdComponents: any = {
  h1: ({ children }: any) => <h1 className="text-2xl font-bold mt-6 mb-4 text-blue-400 border-b border-white/20 pb-2">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-xl font-bold mt-5 mb-3 text-cyan-400">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-lg font-semibold mt-4 mb-2 text-white">{children}</h3>,
  p: ({ children }: any) => <p className="mb-3 leading-relaxed">{children}</p>,
  ul: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-1 ml-2">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-2">{children}</ol>,
  table: ({ children }: any) => <div className="overflow-x-auto my-4 rounded-lg border border-white/20"><table className="min-w-full divide-y divide-white/20">{children}</table></div>,
  thead: ({ children }: any) => <thead className="bg-blue-500/20">{children}</thead>,
  th: ({ children }: any) => <th className="px-4 py-3 text-left text-sm font-semibold text-blue-300">{children}</th>,
  td: ({ children }: any) => <td className="px-4 py-3 text-sm border-t border-white/10">{children}</td>,
  code: ({ className, children }: any) => className?.includes("language-") ? <pre className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto border border-white/10"><code className="text-sm text-green-400">{children}</code></pre> : <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyan-300 text-sm">{children}</code>,
  blockquote: ({ children }: any) => <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-300 bg-blue-500/10 py-2 rounded-r-lg">{children}</blockquote>,
  strong: ({ children }: any) => <strong className="font-bold text-white">{children}</strong>,
  a: ({ href, children }: any) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{children}</a>,
};

// Thinking Animation Component
function ThinkingAnimation({ mode }: { mode: string }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % thinkingPhrases.length);
    }, 2000);
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => { clearInterval(phraseInterval); clearInterval(dotsInterval); };
  }, []);

  const currentPhrase = thinkingPhrases[phraseIndex];
  const Icon = currentPhrase.icon;
  const modeData = modes.find((m) => m.id === mode) || modes[0];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
      <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-r ${modeData.color}`}>
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 p-5 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl">
        {/* Animated thinking header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500" />
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="absolute inset-0 flex items-center justify-center">
              <Icon className="w-4 h-4 text-cyan-400" />
            </motion.div>
          </div>
          <div>
            <motion.p key={phraseIndex} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="font-medium text-cyan-400">
              {currentPhrase.text}
            </motion.p>
            <p className="text-xs text-gray-500">AI is thinking{dots}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} style={{ width: "50%" }} />
        </div>

        {/* Thinking steps */}
        <div className="grid grid-cols-3 gap-2">
          {thinkingPhrases.slice(0, 3).map((phrase, i) => {
            const StepIcon = phrase.icon;
            const isActive = phraseIndex >= i;
            const isCurrent = phraseIndex === i;
            return (
              <motion.div key={i} animate={isCurrent ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0 }} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${isActive ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-gray-500"}`}>
                <StepIcon className="w-3.5 h-3.5" />
                <span className="truncate">{phrase.text.replace("...", "")}</span>
                {isActive && i < phraseIndex && <Check className="w-3 h-3 ml-auto" />}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState("general");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchDb, setSearchDb] = useState("pubmed");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [showTools, setShowTools] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  // Voice input handler
  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser. Try Chrome.");
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + " " + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  // Text-to-speech for responses
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const cleanText = text.replace(/[#*`_\[\]()]/g, "").slice(0, 1000);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  // Apply quick tool
  const applyTool = (toolId: string) => {
    const tool = quickTools.find(t => t.id === toolId);
    if (tool) {
      setSelectedTool(toolId);
      setInput(tool.prompt);
      setShowTools(false);
    }
  };

  const readFile = (file: File): Promise<UploadedFile> => new Promise((resolve) => {
    const reader = new FileReader();
    if (file.type.startsWith("image/")) { reader.onload = (e) => resolve({ name: file.name, type: file.type, size: file.size, content: `[Image]`, preview: e.target?.result as string }); reader.readAsDataURL(file); }
    else { reader.onload = (e) => resolve({ name: file.name, type: file.type, size: file.size, content: (e.target?.result as string)?.slice(0, 10000) || "" }); reader.readAsText(file); }
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < Math.min(files.length, 20 - uploadedFiles.length); i++) newFiles.push(await readFile(files[i]));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }, [uploadedFiles]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/search/${searchDb}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: searchQuery, maxResults: 15 }) });
      const data = await res.json();
      setSearchResults({ source: data.source || searchDb, query: searchQuery, results: data.results || [], totalCount: data.totalCount || 0 });
    } catch (e) { console.error(e); }
    setSearchLoading(false);
  };

  const addSearchToChat = () => {
    if (!searchResults?.results.length) return;
    let content = `**${searchResults.source} Results for "${searchResults.query}"** (${searchResults.totalCount} total)\n\n`;
    searchResults.results.slice(0, 10).forEach((r, i) => {
      content += `${i + 1}. **${r.title}**\n`;
      if (r.authors?.length) content += `   Authors: ${r.authors.slice(0, 3).join(", ")}${r.authors.length > 3 ? "..." : ""}\n`;
      if (r.journal || r.venue) content += `   ${r.journal || r.venue}`;
      if (r.year || r.pubDate) content += ` (${r.year || r.pubDate})`;
      if (r.citationCount || r.citedBy) content += ` • ${r.citationCount || r.citedBy} citations`;
      content += "\n";
      if (r.pmid) content += `   PMID: ${r.pmid}\n`;
      if (r.doi) content += `   DOI: ${r.doi}\n`;
      if (r.nctId) content += `   NCT: ${r.nctId} | Status: ${r.status} | Phase: ${r.phase}\n`;
      content += "\n";
    });
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: `Analyze these search results:\n\n${content}`, timestamp: new Date(), searchResults }]);
    setShowSearch(false);
    sendToAI(`Analyze these academic search results. Identify key themes, methodological patterns, research gaps, and provide recommendations:\n\n${content}`);
  };

  const sendToAI = async (content: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          message: content, 
          mode: selectedMode, 
          files: uploadedFiles.map((f) => ({ name: f.name, type: f.type, content: f.content })), 
          conversationHistory: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
          enableRAG: true,
        }) 
      });
      const data = await res.json();
      const videos = extractYouTubeVideos(data.response || "");
      setMessages((prev) => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: data.response || "Error processing request.", 
        timestamp: new Date(),
        ragEnabled: data.ragEnabled,
        ragSources: data.ragSources,
        ragFactCount: data.ragFactCount,
        media: videos.length > 0 ? { videos } : undefined,
      }]);
    } catch { 
      setMessages((prev) => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: "Error. Please try again.", 
        timestamp: new Date() 
      }]); 
    }
    setIsLoading(false);
    setUploadedFiles([]);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: content.trim(), timestamp: new Date(), files: uploadedFiles.length ? [...uploadedFiles] : undefined }]);
    setInput("");
    await sendToAI(content);
  };

  const currentMode = modes.find((m) => m.id === selectedMode) || modes[0];
  const getFileIcon = (type: string) => type.startsWith("image/") ? ImageIcon : type.includes("csv") ? Table : File;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col" onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
      <AnimatePresence>{isDragging && <motion.div key="drag-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center"><Upload className="w-16 h-16 text-blue-400" /></motion.div>}</AnimatePresence>
      
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#0a0a0a]/98 via-purple-950/30 to-[#0a0a0a]/98 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Portfolio</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">MedResearch AI Lab</h1>
                <p className="text-xs text-gray-500">Powered by Grok 4.1 • RAG Enhanced</p>
              </div>
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-xs text-yellow-400 font-medium">BETA</span>
            </div>

            <div className="flex gap-1">
              <button onClick={() => setShowTools(!showTools)} className={`p-2.5 rounded-xl transition-all ${showTools ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30" : "text-gray-400 hover:bg-white/10 hover:text-white"}`} title="Research Tools">
                <Wand2 className="w-5 h-5" />
              </button>
              <button onClick={() => setShowSearch(!showSearch)} className={`p-2.5 rounded-xl transition-all ${showSearch ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" : "text-gray-400 hover:bg-white/10 hover:text-white"}`} title="Academic Search">
                <Database className="w-5 h-5" />
              </button>
              <button onClick={() => { const c = messages.map((m) => `## ${m.role}\n${m.content}`).join("\n---\n"); const b = new Blob([c], { type: "text/markdown" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "research-session.md"; a.click(); }} className="p-2.5 text-gray-400 hover:bg-white/10 hover:text-white rounded-xl transition-all" title="Export Session">
                <Download className="w-5 h-5" />
              </button>
              <button onClick={() => { setMessages([]); setSearchResults(null); }} className="p-2.5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all" title="Clear Session">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {showSearch && (
            <motion.div key="search-panel" initial={{ width: 0, opacity: 0 }} animate={{ width: 350, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="border-r border-white/10 flex flex-col bg-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-bold mb-3 flex items-center gap-2"><Database className="w-5 h-5 text-cyan-400" />Academic Search</h3>
                <div className="flex flex-wrap gap-2 mb-3">{searchDbs.map((db) => <button key={db.id} onClick={() => setSearchDb(db.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${searchDb === db.id ? `${db.color} text-white` : "bg-white/5 text-gray-400"}`}><db.icon className="w-3.5 h-3.5" />{db.name}</button>)}</div>
                <div className="flex gap-2"><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && performSearch()} placeholder="Search..." className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm" /><button onClick={performSearch} disabled={searchLoading} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">{searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}</button></div>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {searchLoading ? (
                  <div className="py-8 text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-cyan-500/30 border-t-cyan-500" />
                    <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-cyan-400 font-medium">Searching {searchDbs.find(d => d.id === searchDb)?.name}...</motion.p>
                    <p className="text-xs text-gray-500 mt-1">Fetching academic results</p>
                  </div>
                ) : searchResults ? (
                  <>
                    <div className="flex justify-between mb-3">
                      <span className="text-sm text-gray-400">{searchResults.totalCount} results</span>
                      <button onClick={addSearchToChat} className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition-colors flex items-center gap-1"><Sparkles className="w-3 h-3" />Analyze with AI</button>
                    </div>
                    <div className="space-y-2">
                      {searchResults.results.map((r, i) => (
                        <motion.div key={`result-${i}-${r.pmid || r.doi || r.nctId || r.paperId || r.title?.slice(0,20) || i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors">
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">{r.title}</h4>
                          <p className="text-xs text-gray-400">{r.authors?.slice(0, 2).join(", ")}{r.year || r.pubDate ? ` • ${r.year || r.pubDate}` : ""}{r.citationCount || r.citedBy ? ` • ${r.citationCount || r.citedBy} cited` : ""}</p>
                          {r.abstract && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.abstract}</p>}
                          {r.type && <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">{r.type}</span>}
                          {(r.pmid || r.doi || r.url || r.nctId) && <div className="flex gap-2 mt-2">{r.pmid && <a href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}`} target="_blank" className="text-xs text-blue-400 hover:underline">PubMed</a>}{r.doi && <a href={`https://doi.org/${r.doi}`} target="_blank" className="text-xs text-blue-400 hover:underline">DOI</a>}{r.nctId && <a href={r.url} target="_blank" className="text-xs text-orange-400 hover:underline">{r.nctId}</a>}{r.url && !r.pmid && !r.nctId && <a href={r.url} target="_blank" className="text-xs text-blue-400 hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" />View</a>}</div>}
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-500 text-sm">Search academic databases</p>
                    <p className="text-xs text-gray-600 mt-1">PubMed • Semantic Scholar • CrossRef • Clinical Trials</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {showTools && (
            <motion.div key="tools-panel" initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="border-r border-white/10 flex flex-col bg-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-bold mb-2 flex items-center gap-2"><Wand2 className="w-5 h-5 text-purple-400" />Research Tools</h3>
                <p className="text-xs text-gray-500">Quick templates and generators</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {quickTools.map((tool) => (
                  <motion.button key={tool.id} onClick={() => applyTool(tool.id)} whileHover={{ scale: 1.02 }} className={`w-full p-3 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all text-left ${selectedTool === tool.id ? "bg-purple-500/20 border-purple-500" : "bg-white/5"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center`}><tool.icon className="w-5 h-5 text-white" /></div>
                      <div><p className="font-medium text-sm">{tool.name}</p><p className="text-xs text-gray-500 line-clamp-1">{tool.prompt.slice(0, 40)}...</p></div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-white/10 overflow-x-auto"><div className="flex gap-2">{modes.map((mode) => <button key={mode.id} onClick={() => setSelectedMode(mode.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${selectedMode === mode.id ? `bg-gradient-to-r ${mode.color} text-white` : "bg-white/5 text-gray-400"}`}><mode.icon className="w-4 h-4" />{mode.name}</button>)}</div></div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                  <motion.div 
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-purple-500/30"
                  >
                    <FlaskConical className="w-12 h-12 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">Welcome to MedResearch AI Lab</h2>
                  <p className="text-gray-400 max-w-xl mx-auto">Your intelligent research companion powered by <span className="text-cyan-400 font-semibold">Grok 4.1</span> with real-time academic database access and advanced research tools.</p>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
                  <motion.button onClick={() => setShowSearch(true)} whileHover={{ scale: 1.03 }} className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20 hover:border-blue-400/40 text-left transition-all">
                    <Database className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="font-bold mb-1">Academic Search</h3>
                    <p className="text-sm text-gray-500">Search PubMed, Semantic Scholar, CrossRef & more</p>
                  </motion.button>
                  <motion.button onClick={() => setShowTools(true)} whileHover={{ scale: 1.03 }} className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 text-left transition-all">
                    <Wand2 className="w-8 h-8 text-purple-400 mb-3" />
                    <h3 className="font-bold mb-1">Research Tools</h3>
                    <p className="text-sm text-gray-500">PRISMA, PICO, citations, stats & more</p>
                  </motion.button>
                  <motion.button onClick={startVoiceInput} whileHover={{ scale: 1.03 }} className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 hover:border-green-400/40 text-left transition-all">
                    <Mic className="w-8 h-8 text-green-400 mb-3" />
                    <h3 className="font-bold mb-1">Voice Input</h3>
                    <p className="text-sm text-gray-500">Speak your research questions naturally</p>
                  </motion.button>
                </div>

                {/* Suggested Prompts */}
                <div className="max-w-3xl mx-auto">
                  <p className="text-sm text-gray-500 mb-4 text-center">Or try one of these research prompts:</p>
                  <div className="grid gap-3">
                    {[
                      { id: "prompt-pubmed", icon: Search, text: "Search PubMed for recent systematic reviews on AI in radiology diagnosis", color: "blue" },
                      { id: "prompt-trials", icon: Beaker, text: "Find active clinical trials for CAR-T cell therapy in B-cell lymphoma", color: "orange" },
                      { id: "prompt-ideas", icon: Lightbulb, text: "Generate 5 novel meta-analysis research ideas in orthopedic surgery", color: "yellow" },
                    ].map((p, i) => (
                      <motion.button 
                        key={p.id} 
                        onClick={() => sendMessage(p.text)} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.01, x: 5 }}
                        className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 text-left transition-all"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-${p.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                          <p.icon className={`w-5 h-5 text-${p.color}-400`} />
                        </div>
                        <span className="text-gray-300">{p.text}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : messages.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-r ${currentMode.color}`}><Bot className="w-5 h-5 text-white" /></div>}
                <div className={`max-w-[85%] rounded-2xl ${m.role === "user" ? "bg-blue-600 text-white p-4" : "bg-white/5 border border-white/10 p-5"}`}>
                  {m.files?.length ? <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-white/20">{m.files.map((f, i) => { const Icon = getFileIcon(f.type); return <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-sm"><Icon className="w-4 h-4" />{f.name}</div>; })}</div> : null}
                  {m.searchResults && <div className="mb-3 pb-3 border-b border-white/20"><span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">📚 {m.searchResults.results.length} papers from {m.searchResults.source}</span></div>}
                  {m.ragEnabled && <div className="mb-3 pb-3 border-b border-white/20 flex flex-wrap items-center gap-2">
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded flex items-center gap-1"><Zap className="w-3 h-3" />RAG Verified</span>
                    {m.ragFactCount && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">{m.ragFactCount} facts</span>}
                    {m.ragSources?.map((s, i) => <span key={`source-${i}`} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">{s}</span>)}
                  </div>}
                  {m.role === "assistant" ? <div className="prose prose-invert max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]} components={MdComponents}>{m.content}</ReactMarkdown></div> : <div className="whitespace-pre-wrap">{m.content}</div>}
                  {m.media?.videos && m.media.videos.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400 mb-3 flex items-center gap-2"><span className="text-red-500">▶</span> Related Videos</p>
                      <div className="grid gap-3">
                        {m.media.videos.slice(0, 3).map((videoId, vi) => (
                          <div key={vi} className="relative rounded-xl overflow-hidden bg-black aspect-video">
                            <iframe src={`https://www.youtube.com/embed/${videoId}`} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {m.role === "assistant" && <div className="mt-4 pt-3 border-t border-white/10 flex gap-4 flex-wrap"><button onClick={() => { navigator.clipboard.writeText(m.content); setCopiedId(m.id); setTimeout(() => setCopiedId(null), 2000); }} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white">{copiedId === m.id ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}</button><button onClick={() => speakText(m.content)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400"><Volume2 className="w-3.5 h-3.5" />Listen</button>{m.ragEnabled && <span className="text-xs text-purple-400 flex items-center gap-1"><Database className="w-3 h-3" />RAG verified</span>}</div>}
                </div>
                {m.role === "user" && <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-blue-600"><User className="w-5 h-5 text-white" /></div>}
              </motion.div>
            ))}
            {isLoading && <ThinkingAnimation mode={selectedMode} />}
            <div ref={messagesEndRef} />
          </div>

          {uploadedFiles.length > 0 && <div className="px-4 py-3 border-t border-white/10 bg-white/5"><div className="flex items-center gap-2 overflow-x-auto">{uploadedFiles.map((f, i) => { const Icon = getFileIcon(f.type); return <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-sm flex-shrink-0">{f.preview ? <img src={f.preview} className="w-8 h-8 object-cover rounded" /> : <Icon className="w-4 h-4" />}<span className="max-w-[100px] truncate">{f.name}</span><button onClick={() => setUploadedFiles((p) => p.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-400"><X className="w-4 h-4" /></button></div>; })}</div></div>}

          <div className="p-4 border-t border-purple-500/10 bg-gradient-to-r from-[#0a0a0a] via-purple-950/10 to-[#0a0a0a]">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); setSelectedTool(null); }} className="max-w-4xl mx-auto">
              <div className="flex gap-2 items-end">
                <input type="file" ref={fileInputRef} onChange={(e) => handleFiles(e.target.files)} multiple className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all" title="Upload files">
                  <Upload className="w-5 h-5 text-gray-400" />
                </button>
                <button type="button" onClick={startVoiceInput} className={`p-3 rounded-xl border transition-all ${isListening ? "bg-red-500 border-red-400 text-white animate-pulse" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"}`} title="Voice input">
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-gray-400" />}
                </button>
                <div className="flex-1 relative">
                  {selectedTool && <div className="absolute -top-8 left-0 text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full flex items-center gap-1 border border-purple-500/30"><Wand2 className="w-3 h-3" />{quickTools.find(t => t.id === selectedTool)?.name}</div>}
                  <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); setSelectedTool(null); } }} placeholder={selectedTool ? "Complete with your research topic..." : "Ask a research question, search databases, or use AI tools..."} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 resize-none min-h-[52px] max-h-[150px] transition-all" rows={1} />
                </div>
                <button type="submit" disabled={!input.trim() || isLoading} className={`p-3 rounded-xl shadow-lg transition-all ${input.trim() && !isLoading ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-purple-500/30 hover:shadow-purple-500/50" : "bg-white/10 text-gray-500"}`}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-purple-400" />5-Source RAG</span>
                <span className="flex items-center gap-1"><Mic className="w-3 h-3 text-green-400" />Voice</span>
                <span className="flex items-center gap-1"><Database className="w-3 h-3 text-blue-400" />6 Databases</span>
                <span className="flex items-center gap-1"><Wand2 className="w-3 h-3 text-orange-400" />12 Tools</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
