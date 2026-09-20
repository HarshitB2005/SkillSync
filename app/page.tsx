'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Target, 
  BookOpen, 
  FileCheck, 
  ChevronLeft, 
  ChevronRight, 
  UploadCloud, 
  FileText, 
  Home, 
  User,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Loader2
} from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import AuthModal from '../Components/AuthModal';
import { useAuth } from '../context/AuthContext';

// Features Carousel Data
const featuresData = [
  {
    id: 1,
    tag: 'REAL-TIME AI PARSING',
    title: '1. Instant ATS Score & Analysis',
    description: 'Our advanced LLM parses your resume formatting, keywords, and structural layout against top enterprise ATS algorithms to deliver an accurate match percentage instantly.',
    icon: Zap,
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 2,
    tag: 'GAP DETECTOR',
    title: '2. Deep Skill Gap Analysis',
    description: 'Compare your resume against specific target job descriptions. SkillSync pinpoints missing hard/soft skills, key action verbs, and formatting errors holding you back.',
    icon: Target,
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    id: 3,
    tag: 'UP-SKILLING',
    title: '3. Personalized Recommendations',
    description: 'Get tailored course recommendations and actionable tips to bridge identified skill gaps directly from top learning platforms like Coursera and Udemy.',
    icon: BookOpen,
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 4,
    tag: 'JOB MATCHING',
    title: '4. Tailored Resume Generation',
    description: 'Automatically optimize your summary bullet points and skills sections for every job application to pass the initial screening with high scores.',
    icon: FileCheck,
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  }
];

export default function HomePage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API Integration State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % featuresData.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + featuresData.length) % featuresData.length);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Prompt user to sign in if not logged in when uploading
      if (!user) {
        setIsAuthOpen(true);
      }
    }
  };

  const handleDropzoneClick = () => {
    if (isAnalyzing) return; // Prevent opening file browser while analyzing
    fileInputRef.current?.click();
  };

  const handleAnalyzeClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Send file to your backend
      const response = await apiFetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      // Save the AI response locally so the dashboard can load it instantly
      sessionStorage.setItem('currentAnalysis', JSON.stringify(response.data));

      // Route to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Upload Failed:', error);
      setUploadError(error.message || 'An error occurred while analyzing the resume.');
      setIsAnalyzing(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentFeature = featuresData[activeSlide];
  const IconComponent = currentFeature.icon;

  return (
    <div className="min-h-screen bg-[#050814] text-white selection:bg-emerald-500 selection:text-slate-950 font-sans pb-20">
      
      {/* Hidden File Input for Resume Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.doc"
        className="hidden"
      />

      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050814]/80 border-b border-slate-800/60 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={scrollToTop}>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-lg shadow-lg shadow-emerald-500/10">
            S
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            SkillSync <span className="text-emerald-400 font-bold">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-white hover:bg-slate-800 transition"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            Home
          </button>
          
          {user ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                <User className="w-3.5 h-3.5" />
                {user.email ? user.email.split('@')[0] : 'User'}
              </span>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
            >
              <User className="w-3.5 h-3.5" />
              Sign In / Sign Up
            </button>
          )}
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Resume Parsing
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                SkillSync — AI Powered <br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Career Intelligence
                </span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-xl leading-relaxed">
                Instant ATS parsing, detailed match metrics, personalized skill gap recommendations, and real-time job fit percentages.
              </p>
            </div>

            {/* Clickable Interactive Upload Box */}
            {/* API Error Display */}
            {uploadError && (
              <div className="mb-4 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl text-sm font-medium text-center">
                {uploadError}
              </div>
            )}

            {/* Clickable Interactive Upload Box */}
            <div 
              onClick={handleDropzoneClick}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition group cursor-pointer 
                ${isAnalyzing 
                  ? 'border-emerald-500/50 bg-slate-900/50 opacity-80 pointer-events-none' 
                  : 'border-emerald-500/30 hover:border-emerald-500/70 bg-slate-900/30 hover:bg-slate-900/50 active:scale-[0.99]'
                } backdrop-blur-md`}
            >
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                {isAnalyzing ? (
                  <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
                ) : selectedFile ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                ) : (
                  <UploadCloud className="w-7 h-7 text-emerald-400" />
                )}
              </div>

              {selectedFile ? (
                <div>
                  <h3 className="text-lg font-bold text-emerald-400 mb-1 flex items-center justify-center gap-2">
                    {selectedFile.name}
                  </h3>
                  <p className="text-slate-400 text-xs mb-4">
                    {isAnalyzing ? 'Extracting text and running AI analysis...' : 'Click to change or select a different resume'}
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Upload Your Resume</h3>
                  <p className="text-slate-400 text-xs mb-4">Click to browse or drag & drop your resume (PDF or DOCX)</p>
                </div>
              )}

              {/* ACTION BUTTON TO TRIGGER ANALYSIS */}
              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex justify-center"
                >
                  <button
                    onClick={handleAnalyzeClick}
                    disabled={isAnalyzing}
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 disabled:from-emerald-600 disabled:to-emerald-700 text-slate-950 font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
                  >
                    {isAnalyzing ? (
                      <>
                        <span>Analyzing...</span>
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        <span>Analyze Resume Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              )}
              
              <div className="flex justify-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
                  <FileText className="w-3 h-3 text-emerald-400" /> PDF
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
                  <FileText className="w-3 h-3 text-cyan-400" /> DOCX
                </span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Platform Insights (4-Grid) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Platform Insights</h3>
                <p className="text-xs text-slate-400 mt-1">Real-time metrics powering modern job seekers</p>
              </div>

              <div className="grid grid-cols-2 gap-4 my-auto py-6">
                <div className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-2xl">
                  <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">10k+</div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">Resumes Analyzed</div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-2xl">
                  <div className="text-2xl md:text-3xl font-extrabold text-cyan-400">4.9★</div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">Average Rating</div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-2xl">
                  <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">85%+</div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">ATS Match Rate</div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-2xl">
                  <div className="text-2xl md:text-3xl font-extrabold text-cyan-400">3x</div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">Interview Rate</div>
                </div>
              </div>

              <div className="text-xs text-slate-500 text-center border-t border-slate-800/60 pt-4">
                Updated live from SkillSync core API
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. How It Works & Features Section (Multi-Slide Carousel) */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider bg-slate-800/80 text-cyan-400 border border-slate-700">
            HOW IT WORKS & FEATURES
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">
            Everything You Need to Beat the ATS
          </h2>
        </div>

        {/* Feature Selector Tabs */}
        <div className="flex justify-center items-center gap-2 mb-8 flex-wrap">
          {featuresData.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveSlide(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeSlide === idx
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-950/40 border border-transparent'
              }`}
            >
              Step {item.id}
            </button>
          ))}
        </div>

        {/* Animated Slide Content Box */}
        <div className="relative bg-slate-900/60 border border-slate-800 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center shadow-inner">
                <IconComponent className="w-12 h-12 text-emerald-400" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider border mb-3 ${currentFeature.badgeColor}`}>
                  {currentFeature.tag}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {currentFeature.title}
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  {currentFeature.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-800/60">
            <button
              onClick={prevSlide}
              className="p-2.5 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
              aria-label="Previous Feature"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1.5">
              {featuresData.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    activeSlide === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2.5 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
              aria-label="Next Feature"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Auth Modal Popup */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => setUser(loggedUser)}
      />

    </div>
  );
}