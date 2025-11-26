// Portfolio Data Store - All content is editable
export const portfolioData = {
  // Personal Information
  personal: {
    name: "Dr. Atef Abdelrahman Hassan",
    title: "MD | AI & ML Specialist in Healthcare",
    subtitle: "Chief Operating Officer at OrthoGlobe | Founder of CiteSort.AI",
    email: "atef.Hassan@orthoglobe.org",
    location: "Cairo, Egypt",
    university: "Faculty of Medicine, Al-Azhar University",
    bio: `Innovative physician-researcher and AI enthusiast with a track record of building tools that streamline evidence synthesis and surgical decision-making. As COO of OrthoGlobe and founder of CiteSort.AI, I blend frontline clinical experience with ML-powered analytics to accelerate high-impact studies and improve patient outcomes worldwide.`,
    profileImage: "/images/profile.jpg",
  },

  // Social Links
  socialLinks: {
    researchGate: "https://www.researchgate.net/profile/Atef-Hassan-5",
    linkedin: "https://www.linkedin.com/in/atef-hassan-a853a5256/",
    orcid: "https://orcid.org/0000-0003-3393-9105",
    googleScholar: "https://scholar.google.com/citations?user=i7x6i1IAAAAJ&hl=en",
    github: "https://github.com/atefhassan",
    email: "atef.Hassan@orthoglobe.org",
  },

  // Statistics
  stats: [
    { label: "Citations", value: "69+", icon: "quote" },
    { label: "Publications", value: "20+", icon: "file-text" },
    { label: "AI Projects", value: "5+", icon: "brain" },
    { label: "H-Index", value: "4", icon: "trending-up" },
  ],

  // Skills
  skills: [
    { name: "Machine Learning", level: 95 },
    { name: "Clinical Research", level: 98 },
    { name: "Deep Learning", level: 90 },
    { name: "Systematic Reviews", level: 95 },
    { name: "Medical Image Analysis", level: 88 },
    { name: "Python / TensorFlow", level: 92 },
    { name: "Data Analysis", level: 90 },
    { name: "Healthcare AI", level: 94 },
  ],

  // Organizations
  organizations: [
    {
      name: "CiteSort.AI",
      role: "Founder & CEO",
      logo: "/images/citesort-logo.png",
      url: "https://citesort.ai",
      description: "AI-Powered Systematic Review Platform",
      details: `Transform your systematic review workflow with AI. CiteSort.AI offers GPT-5 powered screening with 95%+ accuracy, smart duplicate detection, team collaboration with blind screening mode, database search integration (PubMed, Scopus), and flexible import/export options.`,
      features: [
        "AI-Powered Screening with 95%+ accuracy",
        "Smart Duplicate Detection",
        "Team Collaboration & Blind Screening",
        "Database Search Integration (PubMed, Scopus)",
        "Multiple Import/Export Formats",
        "Real-Time Progress Tracking",
        "Conversational AI Setup",
        "Cohen's Kappa Calculation",
      ],
    },
    {
      name: "OrthoGlobe",
      role: "Chief Operating Officer",
      logo: "/images/orthoglobe-logo.png",
      url: "https://orthoglobe.org",
      description: "International Orthopaedic Network",
      details: `The OrthoGlobe is an international Orthopaedic network, based in London, that aims to advance musculoskeletal practice worldwide. As COO, I lead initiatives to enhance musculoskeletal health outcomes through AI-driven methodologies, ensuring that technology supports clinical expertise.`,
      features: [
        "Global Research Collaboration",
        "AI-Driven Clinical Research",
        "Musculoskeletal Health Advancement",
        "Evidence-Based Practice",
        "Professional Medical Network",
        "Patient Education Resources",
      ],
    },
  ],

  // AI Projects
  aiProjects: [
    {
      title: "IntelliSpine",
      description: "AI-powered spine analysis and diagnostic tool using deep learning for automated vertebral segmentation and pathology detection.",
      video: "/videos/IntelliSpine.mp4",
      technologies: ["Deep Learning", "Medical Imaging", "Computer Vision", "TensorFlow"],
      status: "Active",
    },
    {
      title: "OCT Retinal Classifier",
      description: "Advanced optical coherence tomography image classifier for detecting retinal diseases including diabetic retinopathy and macular degeneration.",
      video: "/videos/OCT Retinal Classifier.mp4",
      technologies: ["CNN", "Medical Imaging", "PyTorch", "Healthcare AI"],
      status: "Active",
    },
    {
      title: "OsteoFuture",
      description: "Predictive model for osteoporosis risk assessment and bone health monitoring using machine learning algorithms.",
      video: "/videos/OsteoFuture.mp4",
      technologies: ["Machine Learning", "Predictive Analytics", "Healthcare", "Python"],
      status: "Active",
    },
    {
      title: "RCC Classifier",
      description: "Renal Cell Carcinoma classification system using deep learning for accurate diagnosis and staging support.",
      video: "/videos/RCC.mp4",
      technologies: ["Deep Learning", "Oncology AI", "Image Classification", "Medical AI"],
      status: "Active",
    },
  ],

  // Publications
  publications: [
    {
      title: "Comparative effectiveness and safety of eplerenone and spironolactone in patients with heart failure: a systematic review and meta-analysis",
      citations: 11,
      year: 2023,
      journal: "Systematic Review",
    },
    {
      title: "Phosphodiesterase-5 inhibitors use and the risk of alzheimer's disease: a systematic review and meta-analysis",
      citations: 10,
      year: 2023,
      journal: "Meta-Analysis",
    },
    {
      title: "Robotic assisted vs. open ureteral reimplantation in adults: a systematic review and meta-analysis",
      citations: 5,
      year: 2023,
      journal: "Systematic Review",
    },
    {
      title: "Dorsal‐vs ventral‐onlay buccal mucosal graft urethroplasty for urethral strictures: a meta‐analysis",
      citations: 3,
      year: 2023,
      journal: "Meta-Analysis",
    },
    {
      title: "Intersection of artificial intelligence, microbes, and bone and joint infections: a new frontier for improving management outcomes",
      citations: 3,
      year: 2024,
      journal: "Review Article",
    },
    {
      title: "History of head trauma and the risk of multiple sclerosis: A systematic review and meta-analysis",
      citations: 1,
      year: 2024,
      journal: "Meta-Analysis",
    },
    {
      title: "Effects of non-invasive vagus nerve stimulation on inflammatory markers in covid-19 patients: A systematic review and meta-analysis",
      citations: 1,
      year: 2023,
      journal: "Systematic Review",
    },
    {
      title: "Standalone 29-MHz micro-ultrasound for classifying clinically significant prostate cancer: a diagnostic test accuracy meta-analysis",
      citations: 0,
      year: 2024,
      journal: "Meta-Analysis",
    },
  ],

  // AI Courses
  aiCourses: [
    {
      title: "Deep Learning for Medical Imaging",
      provider: "Coursera / Stanford",
      description: "Comprehensive course covering CNN architectures for medical image analysis, including X-ray, CT, and MRI interpretation.",
      link: "#",
      level: "Advanced",
    },
    {
      title: "Machine Learning in Healthcare",
      provider: "MIT OpenCourseWare",
      description: "Clinical machine learning applications including risk prediction, diagnosis support, and treatment optimization.",
      link: "#",
      level: "Intermediate",
    },
    {
      title: "AI for Medical Diagnosis",
      provider: "DeepLearning.AI",
      description: "Practical AI techniques for medical diagnosis including chest X-ray analysis and brain tumor detection.",
      link: "#",
      level: "Advanced",
    },
    {
      title: "Natural Language Processing in Healthcare",
      provider: "Google Cloud",
      description: "NLP techniques for clinical text mining, medical record analysis, and literature synthesis.",
      link: "#",
      level: "Intermediate",
    },
  ],

  // Recommended Materials
  recommendedMaterials: [
    {
      title: "Deep Medicine by Eric Topol",
      type: "Book",
      description: "How AI can make healthcare human again - essential reading for healthcare AI practitioners.",
      link: "#",
    },
    {
      title: "The Algorithm Will See You Now",
      type: "Article",
      description: "Exploring the future of AI-driven diagnostics and personalized medicine.",
      link: "#",
    },
    {
      title: "Medical Image Analysis with Deep Learning",
      type: "Course",
      description: "Comprehensive tutorial on applying CNNs to medical imaging challenges.",
      link: "#",
    },
    {
      title: "PRISMA Guidelines for Systematic Reviews",
      type: "Resource",
      description: "Essential guidelines for conducting and reporting systematic reviews and meta-analyses.",
      link: "http://www.prisma-statement.org/",
    },
    {
      title: "Cochrane Handbook",
      type: "Resource",
      description: "The gold standard for systematic review methodology in healthcare research.",
      link: "https://training.cochrane.org/handbook",
    },
  ],

  // New Projects (Coming Soon)
  newProjects: [
    {
      title: "AI-Powered Clinical Decision Support",
      description: "Next-generation clinical decision support system integrating real-time patient data with evidence-based guidelines.",
      status: "In Development",
      eta: "Q2 2025",
    },
    {
      title: "Surgical Outcome Predictor",
      description: "Machine learning model for predicting surgical outcomes and optimizing pre-operative planning.",
      status: "Research Phase",
      eta: "Q3 2025",
    },
    {
      title: "Medical Literature Synthesizer",
      description: "Advanced NLP system for automatic synthesis of medical literature and evidence grading.",
      status: "In Development",
      eta: "Q1 2025",
    },
  ],

  // Contributions
  contributions: [
    {
      type: "Open Source",
      title: "Medical AI Toolkit",
      description: "Collection of pre-trained models and utilities for medical image analysis.",
      link: "#",
    },
    {
      type: "Research",
      title: "OrthoGlobe Research Network",
      description: "Leading collaborative research initiatives in orthopedic surgery and musculoskeletal health.",
      link: "https://orthoglobe.org",
    },
    {
      type: "Education",
      title: "AI in Healthcare Workshops",
      description: "Regular workshops and seminars on applying AI in clinical settings.",
      link: "#",
    },
  ],

  // Testimonials
  testimonials: [
    {
      name: "Prof. Mohamed A. Imam",
      role: "Founder, OrthoGlobe",
      text: "Dr. Hassan's expertise in AI and clinical research has been instrumental in advancing our research capabilities at OrthoGlobe.",
    },
    {
      name: "Research Collaborator",
      role: "International Researcher",
      text: "Working with Dr. Hassan on systematic reviews has been an exceptional experience. His attention to detail and innovative use of AI tools sets a new standard.",
    },
  ],
};

export default portfolioData;
