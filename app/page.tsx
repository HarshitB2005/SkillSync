'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUploader from '../components/FileUploader';
import LoadingState from '../components/LoadingState';
import Dashboard from '../components/Dashboard';
import { 
  ArrowRight, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  BrainCircuit, 
  Target, 
  BookOpen, 
  Zap,
  Home as HomeIcon,
  Sparkles
} from 'lucide-react';

// Feature Slides Content
const featureSlides = [
  {
    id: 1,
    title: "1. Instant ATS Score & Analysis",
    subtitle: "Real-time AI Parsing",
    icon: <Zap className="w-8 h-8 text-emerald-400" />,
    description: "Our advanced LLM parses your resume formatting, keywords, and structural layout against top enterprise ATS algorithms to deliver an accurate match percentage instantly.",
    highlights: ["Formatting Check", "Keyword Density", "Impact Score"]
  },
  {
    id: 2,
    title: "2. Skill Gap Identification",
    subtitle: "Identify What's Missing",
    icon: <BrainCircuit className="w-8 h-8 text-cyan-400" />,
    description: "Detects both your existing hard skills and pinpoints critical missing technical competencies required for your targeted industry roles.",
    highlights: ["Detected Skills", "Missing Keyword Badges", "Industry Benchmarking"]
  },
  {
    id: 3,
    title: "3. Personalized Learning Roadmap",
    subtitle: "Bridge Your Knowledge Gaps",
    icon: <BookOpen className="w-8 h-8 text-teal-400" />,
    description: "Generates tailored course recommendations from top platforms (Udemy, Coursera, etc.) specifically curated to fill your identified skill gaps.",
    highlights: ["Direct Course Links", "Targeted Upskilling", "Platform Filters"]
  },
  {
    id: 4,
    title: "4. Smart Job Target Matching",
    subtitle: "Role Fit Percentages",
    icon: <Target className="w-8 h-8 text-emerald-400" />,
    description: "Calculates fit scores for relevant modern job titles, highlighting exact missing qualifications so you apply only where you stand out.",
    highlights: ["Role Fit Index", "Location Preference", "Qualifications Analysis"]
  }
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);

  // State for Features Carousel Slide
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsAnalyzed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 3000);
  };

  const handleResetHome = () => {
    if (isAnalyzed) {
      setIsAnalyzed(false);
      setIsLoading(false);
      setFile(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featureSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featureSlides.length) % featureSlides.length);
  };

  return (
    <main className="min-h-screen relative text-slate-100 bg-slate-950 font-sans tracking-normal overflow-x-hidden">
      
      {/* 1. PERMANENT FIXED NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div 
            onClick={handleResetHome}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-cyan-400 rounded-xl flex items-center justify-center font-extrabold text-slate-950 text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              SkillSync <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">AI</span>
            </span>
          </div>

          {/* Home Button and Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleResetHome}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/80 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-semibold text-sm border border-slate-700/60 transition shadow-md"
            >
              <HomeIcon className="w-4 h-4 text-emerald-400 hover:text-slate-950" />
              Home
            </button>

            {!isAnalyzed && (
              <button 
                onClick={handleResetHome}
                className="hidden sm:flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold rounded-full text-sm transition shadow-lg shadow-emerald-500/20"
              >
                <Sparkles className="w-4 h-4" />
                Analyze Resume
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* 2. Background Video with Dark Overlay */}
      {!isAnalyzed && (
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 opacity-40"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-lines-movement-27670-large.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/70" />
        </div>
      )}

      {/* 3. Main Body Container */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16 relative z-10 space-y-20">
        {!isAnalyzed ? (
          <>
            {/* HERO & UPLOAD SECTION */}
            <div id="upload-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
              
              {/* Left Column: Hero Copy & Dropzone */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Next-Gen Resume Parsing
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
                  SkillSync — AI Powered <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                    Career Intelligence
                  </span>
                </h1>

                <p className="text-slate-300 text-base md:text-lg max-w-xl leading-relaxed font-normal">
                  Instant ATS parsing, detailed match metrics, personalized skill gap recommendations, and real-time job fit percentages.
                </p>

                {/* Upload Component Embedded inside Hero */}
                <div className="max-w-lg pt-2">
                  {!isLoading ? (
                    <FileUploader onFileUpload={handleFileUpload} />
                  ) : (
                    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 backdrop-blur-xl">
                      <LoadingState />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right Column: Glassmorphism Platform Stats */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-5"
              >
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Platform Insights
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">Real-time metrics powering modern job seekers</p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                    <div>
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight block">10k+</span>
                      <span className="text-xs font-medium text-slate-400">Resumes Analyzed</span>
                    </div>

                    <div>
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight flex items-center gap-1">
                        4.9 <Star className="w-5 h-5 fill-emerald-400 text-emerald-400" />
                      </span>
                      <span className="text-xs font-medium text-slate-400">Average Rating</span>
                    </div>

                    <div>
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight block">98%</span>
                      <span className="text-xs font-medium text-slate-400">ATS Accuracy Rate</span>
                    </div>

                    <div>
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight block">3x</span>
                      <span className="text-xs font-medium text-slate-400">More Interview Invites</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* FEATURES SHOWCASE (SLIDES CAROUSEL) */}
            <section className="pt-12 border-t border-slate-800/80">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-cyan-400 font-bold uppercase text-xs tracking-widest bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
                  How It Works & Features
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-3 tracking-tight">
                  Everything You Need to Beat the ATS
                </h2>
              </div>

              {/* Feature Slide Display Box */}
              <div className="relative max-w-4xl mx-auto bg-slate-900/70 border border-slate-800 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featureSlides[currentSlide].id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
                  >
                    <div className="md:col-span-3 flex justify-center">
                      <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-inner">
                        {featureSlides[currentSlide].icon}
                      </div>
                    </div>

                    <div className="md:col-span-9 space-y-4 text-center md:text-left">
                      <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        {featureSlides[currentSlide].subtitle}
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        {featureSlides[currentSlide].title}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {featureSlides[currentSlide].description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                        {featureSlides[currentSlide].highlights.map((tag, i) => (
                          <span key={i} className="text-xs bg-slate-800 text-cyan-300 border border-slate-700 px-3 py-1 rounded-full font-medium">
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Navigation Controls */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
                  <button
                    onClick={prevSlide}
                    className="p-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition border border-slate-700"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Indicator Dots */}
                  <div className="flex gap-2">
                    {featureSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          currentSlide === idx ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 w-8' : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    className="p-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition border border-slate-700"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* DASHBOARD VIEW */
          <div>
            <div className="mb-6 flex justify-between items-center bg-slate-900/90 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
              <span className="text-sm font-semibold text-slate-300">
                Analysis Complete for: <strong className="text-emerald-400">{file?.name}</strong>
              </span>
              <button
                onClick={handleResetHome}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-2"
              >
                Upload Another Resume <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <Dashboard />
          </div>
        )}
      </div>
    </main>
  );
}