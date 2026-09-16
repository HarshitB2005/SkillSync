'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Target, 
  AlertTriangle, 
  BookOpen, 
  Briefcase, 
  Zap, 
  UserCheck, 
  Star, 
  BrainCircuit, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Circle,
  History,
  Download 
} from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';

// --- Interfaces for Live Data ---
interface Insight {
  id?: number | string;
  title?: string;
  text: string;
}

interface AnalysisData {
  atsScore: number;
  breakdown?: { formatting: number; impact: number; keywords: number; resumeLength: number };
  insights?: { strengths: Insight[]; weaknesses: Insight[] };
  skills?: { detected: string[]; suggested: string[] };
  learningRoadmap?: { title: string; platform: string; search: string }[];
  matchedJobs?: { title: string; match: number; missing: string[]; location: string }[];
}

interface HistoryItem {
  id: string;
  fileName: string;
  createdAt: string;
  data: AnalysisData;
}

const defaultTimeline = [
  { id: 1, stage: "Resume Parsed", description: "Format and structure extracted successfully.", status: "completed" },
  { id: 2, stage: "ATS Score Generated", description: "Scored against standard frontend benchmarks.", status: "completed" },
  { id: 3, stage: "Skill Gap Identified", description: "Missing skills detected for optimal targeting.", status: "in-progress" },
  { id: 4, stage: "Optimization Phase", description: "Add missing keywords and quantifiable metrics.", status: "upcoming" },
  { id: 5, stage: "Job Ready", description: "Target matches over 90% score capability.", status: "upcoming" }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardSlideIn = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
};

// --- DEFENSIVE AI UTILITIES ---
const safeArray = (data: any) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return [data]; 
};

export default function Dashboard() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState(defaultTimeline);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const response = await apiFetch('/api/history');
        if (response.history && response.history.length > 0) {
          setHistory(response.history);
          setAnalysisData(response.history[0].data);
        } else {
          console.log("No analysis history found for user.");
        }
      } catch (error) {
        console.error("Failed to fetch live data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const toggleTimelineStage = (id: number) => {
    setTimeline((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'completed' ? 'in-progress' : item.status === 'in-progress' ? 'upcoming' : 'completed';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // --- Native Print Export (Bypasses html2canvas & oklab errors completely) ---
  const exportToPDF = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center text-emerald-400 gap-4">
        <Zap className="w-12 h-12 animate-pulse" />
        <p className="font-bold tracking-widest uppercase text-sm">Fetching Live Analysis...</p>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center text-white gap-4">
        <AlertTriangle className="w-12 h-12 text-amber-400" />
        <h2 className="text-2xl font-bold">No Analysis Found</h2>
        <p className="text-slate-400">Please upload a resume first to generate your dashboard.</p>
        <Link href="/" className="mt-4 px-6 py-2 bg-emerald-500 text-slate-950 font-bold rounded-full hover:bg-emerald-400 transition">
          Go to Upload
        </Link>
      </div>
    );
  }

  const currentScore = analysisData.atsScore ?? 0;
  const scoreColor = getScoreColor(currentScore);

  return (
    <div className="min-h-screen bg-[#050814] text-white selection:bg-emerald-500 selection:text-slate-950 font-sans pb-20">
      
      {/* Added print:hidden so the navigation bar is automatically hidden when printing/saving PDF */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050814]/80 border-b border-slate-800/60 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto mb-8 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-lg shadow-lg shadow-emerald-500/10">
            S
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            SkillSync <span className="text-emerald-400 font-bold">Dashboard</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold cursor-pointer hover:bg-emerald-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Save as PDF
          </button>

          {history.length > 1 && (
            <div className="relative group">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer">
                <History className="w-3.5 h-3.5 text-emerald-400" />
                Previous Scans
              </div>
              
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50 overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {history.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => setAnalysisData(item.data)} 
                      className="w-full text-left px-4 py-3 hover:bg-slate-800 border-b border-slate-800/50 flex flex-col gap-1 last:border-0 transition"
                    >
                      <span className="text-sm font-bold text-white truncate w-full block">
                        {item.fileName || 'Untitled Resume'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()} • Score: <span className={getScoreColor(item.data.atsScore)}>{item.data.atsScore}%</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-white hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="pt-2 pb-8 bg-[#050814]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 space-y-8"
        >
          <motion.div variants={cardSlideIn} className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-8 bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col justify-center">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mb-3">
                <Zap className="w-8 h-8 text-emerald-400" />
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">AI Resume Analysis Roadmap</h1>
              </motion.div>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">
                We have generated an in-depth analysis of your resume against current industry standard ATS systems. Here is your personalized feedback and targeted job roadmap.
              </p>
            </div>
            
            <motion.div 
              key={currentScore} 
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="relative w-40 h-40 flex items-center justify-center rounded-full bg-slate-950/80 border-4 border-slate-800 mx-auto md:mx-0 shadow-inner"
            >
              <div className="text-center">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className={`text-5xl font-black ${scoreColor} tracking-tighter`}
                >
                  {currentScore}
                </motion.span>
                <p className="text-xs font-bold text-slate-400 mt-1">% ATS Score</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={cardSlideIn} className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Clock className="w-6 h-6 text-emerald-400" /> Analysis & Optimization Progress Timeline
              </h3>
              <span className="text-xs text-slate-400 hidden sm:inline-block">Click any step to update progress status</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {timeline.map((item) => {
                const isCompleted = item.status === 'completed';
                const isInProgress = item.status === 'in-progress';

                return (
                  <div 
                    key={item.id} 
                    onClick={() => toggleTimelineStage(item.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                      isCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : isInProgress 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold tracking-wider uppercase">Stage 0{item.id}</span>
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {isInProgress && <Clock className="w-4 h-4 text-amber-400 animate-pulse" />}
                        {!isCompleted && !isInProgress && <Circle className="w-4 h-4 text-slate-600" />}
                      </div>
                      <h4 className="font-bold text-sm text-white mb-1">{item.stage}</h4>
                      <p className="text-xs text-slate-400">{item.description}</p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-semibold">
                      <span className="capitalize">{item.status.replace('-', ' ')}</span>
                      <span className="text-slate-500">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={cardSlideIn} className="bg-slate-900/60 p-8 rounded-3xl border border-emerald-500/20 backdrop-blur-xl shadow-xl">
              <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-3 mb-6 border-b pb-4 border-slate-800">
                <UserCheck className="w-6 h-6 text-emerald-400" /> Key Resume Strengths
              </h3>
              <ul className="space-y-3">
                {safeArray(analysisData.insights?.strengths).length === 0 ? (
                  <p className="text-slate-400 text-sm">No specific strengths detected yet.</p>
                ) : (
                  safeArray(analysisData.insights?.strengths).map((insight: any, idx: number) => (
                    <li key={insight.id || idx} className="flex gap-3 text-slate-300 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl items-start text-sm">
                      <Star className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{typeof insight === 'string' ? insight : insight.text || 'Valid strength detected'}</span>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>

            <motion.div variants={cardSlideIn} className="bg-slate-900/60 p-8 rounded-3xl border border-red-500/20 backdrop-blur-xl shadow-xl">
              <h3 className="text-xl font-bold text-red-400 flex items-center gap-3 mb-6 border-b pb-4 border-slate-800">
                <AlertTriangle className="w-6 h-6 text-red-400" /> Actionable Improvements
              </h3>
              <ul className="space-y-4">
                {safeArray(analysisData.insights?.weaknesses).length === 0 ? (
                  <p className="text-slate-400 text-sm">Your resume looks flawless! No major weaknesses detected.</p>
                ) : (
                  safeArray(analysisData.insights?.weaknesses).map((item: any, idx: number) => (
                    <li key={item.id || idx} className="flex gap-3 text-slate-300 p-4 rounded-2xl bg-slate-950/60 border border-red-500/20 shadow-sm items-start">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-white text-base">{typeof item === 'string' ? "Improvement Area" : item.title || "Improvement Area"}</p>
                        <p className="text-slate-400 text-xs mt-1">{typeof item === 'string' ? item : item.text || "Actionable improvement identified"}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          </div>

          <motion.div variants={cardSlideIn} className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
              <BrainCircuit className="w-6 h-6 text-emerald-400" /> Skill Knowledge Gaps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,1.3fr] gap-8">
              <div className="p-6 bg-slate-950/60 rounded-2xl border border-slate-800">
                <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Detected Skills</p>
                <div className="flex flex-wrap gap-2.5">
                  {safeArray(analysisData.skills?.detected).map((skill: any, idx: number) => (
                    <span key={`detected-${idx}`} className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold rounded-full text-xs">
                      {typeof skill === 'string' ? skill : skill.name || skill.title || 'Unknown Skill'}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-amber-500/5 rounded-2xl border border-amber-500/20">
                <p className="text-xs font-semibold text-amber-400 mb-3 uppercase tracking-wider">Strongly Recommended Skills to Add</p>
                <div className="flex flex-wrap gap-2.5">
                  {safeArray(analysisData.skills?.suggested).map((skill: any, idx: number) => (
                    <span key={`suggested-${idx}`} className="px-3.5 py-1.5 bg-amber-500/10 text-amber-300 font-bold rounded-full text-xs border border-amber-500/30">
                      + {typeof skill === 'string' ? skill : skill.name || skill.title || 'Unknown Skill'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={cardSlideIn} className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6 border-b pb-4 border-slate-800">
                <BookOpen className="w-6 h-6 text-emerald-400" /> Personalized Learning Roadmap
              </h3>
              <div className="space-y-4">
                {safeArray(analysisData.learningRoadmap).length === 0 ? (
                  <p className="text-slate-400 text-sm">No current learning recommendations.</p>
                ) : (
                  safeArray(analysisData.learningRoadmap).map((course: any, i: number) => (
                    <motion.a 
                      whileHover={{ y: -2, scale: 1.01 }}
                      key={i} href="#" target="_blank" className="block p-5 bg-slate-950/60 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition group"
                    >
                      <p className="font-semibold text-slate-200 group-hover:text-emerald-400 text-sm transition">
                        {typeof course === 'string' ? course : course.title || 'Recommended Course'}
                      </p>
                      <p className="text-xs text-emerald-400 font-medium mt-1">
                        {typeof course === 'string' ? 'Online Resource' : course.platform || 'Online Resource'}
                      </p>
                    </motion.a>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div variants={cardSlideIn} className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6 border-b pb-4 border-slate-800">
                <Briefcase className="w-6 h-6 text-emerald-400" /> Optimized Job Target
              </h3>
              <div className="space-y-4">
                {safeArray(analysisData.matchedJobs).length === 0 ? (
                  <p className="text-slate-400 text-sm">Update your resume to get matched jobs.</p>
                ) : (
                  safeArray(analysisData.matchedJobs).map((job: any, i: number) => {
                    const matchScore = job.match ?? 0;
                    const jobScoreColor = matchScore >= 85 ? 'text-emerald-400' : matchScore >= 70 ? 'text-amber-400' : 'text-red-400';
                    
                    return (
                      <div key={i} className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-base text-white">{typeof job === 'string' ? job : job.title || 'Relevant Role'}</p>
                          <p className="text-xs text-slate-400 mt-1">Gap: {safeArray(job.missing).join(", ") || 'None'}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{typeof job === 'string' ? 'Flexible' : job.location || 'Flexible'}</p>
                        </div>
                        <div className={`text-3xl font-black ${jobScoreColor}`}>
                          {matchScore}%
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}