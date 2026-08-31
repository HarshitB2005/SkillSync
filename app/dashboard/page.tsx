'use client';

import React, { useState } from 'react';
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
  Circle
} from 'lucide-react';

// sample data for demonstration - in real app, these values are populated from backend API
const analysisData = {
  atsScore: 78,
  breakdown: { formatting: 90, impact: 65, keywords: 80, resumeLength: 85 },
  insights: {
    strengths: [
      { id: 1, text: "Strong technical action verbs throughout work history." },
      { id: 2, text: "Clear Education and Project sections." },
      { id: 3, text: "Strong background in frontend framework React." },
    ],
    weaknesses: [
      { id: 1, title: "Missing Core Keywords", text: "Resume lacks mentions of Docker, TypeScript, or REST APIs." },
      { id: 2, title: "No Quantifiable Metrics", text: "Work descriptions miss numbers (e.g., 'Improved performance' vs 'Improved performance by 25%')." },
      { id: 3, title: "Generic Objective", text: "The summary section is generic and doesn't target a specific role." },
    ]
  },
  skills: {
    detected: ["React", "JavaScript", "Node.js", "HTML/CSS", "Tailwind CSS", "Git"],
    suggested: ["TypeScript", "Docker", "REST API Optimization", "GraphQL"],
  },
  learningRoadmap: [
    { title: 'Understanding TypeScript - Complete Developer Guide', platform: 'Udemy', search: 'Typescript developer course' },
    { title: 'Docker & Kubernetes: The Practical Guide', platform: 'Coursera', search: 'Docker beginner course' },
    { title: 'REST APIs with Node.js and Express', platform: 'Udemy', search: 'REST API Nodejs' },
  ],
  matchedJobs: [
    { title: 'Frontend Developer (React)', match: 92, missing: ["TypeScript"], location: "Remote" },
    { title: 'Full Stack Web Developer', match: 74, missing: ["Docker", "Typescript", "GraphQL"], location: "Hybrid/Mumbai" },
    { title: 'Junior Software Engineer', match: 86, missing: ["Testing Fundamentals"], location: "Remote" },
  ],
  // Timeline Stages
  progressTimeline: [
    { id: 1, stage: "Resume Parsed", description: "Format and structure extracted successfully.", status: "completed" },
    { id: 2, stage: "ATS Score Generated", description: "Scored 78% against standard frontend benchmarks.", status: "completed" },
    { id: 3, stage: "Skill Gap Identified", description: "4 missing skills detected for optimal targeting.", status: "in-progress" },
    { id: 4, stage: "Optimization Phase", description: "Add missing keywords and quantifiable metrics.", status: "upcoming" },
    { id: 5, stage: "Job Ready", description: "Target matches over 90% score capability.", status: "upcoming" }
  ]
};

// --- Animation Keyframes ---
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardSlideIn = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

// Function to handle color based on score
const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
};

export default function Dashboard() {
  const scoreColor = getScoreColor(analysisData.atsScore);
  const [timeline, setTimeline] = useState(analysisData.progressTimeline);

  // Toggle stage completion interactively
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

  return (
    <div className="min-h-screen bg-[#050814] text-white selection:bg-emerald-500 selection:text-slate-950 font-sans pb-20">
      
      {/* 0. Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050814]/80 border-b border-slate-800/60 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-lg shadow-lg shadow-emerald-500/10">
            S
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            SkillSync <span className="text-emerald-400 font-bold">Dashboard</span>
          </span>
        </div>

        <Link 
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-white hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          Back to Home
        </Link>
      </header>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 space-y-8"
      >
        {/* 1. Header & Main Score Gauge */}
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
          
          {/* Animated Score Circle */}
          <motion.div 
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
                {analysisData.atsScore}
              </motion.span>
              <p className="text-xs font-bold text-slate-400 mt-1">% ATS Score</p>
            </div>
          </motion.div>
        </motion.div>

        {/* --- NEW: Interactive Progress Timeline Section --- */}
        <motion.div variants={cardSlideIn} className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Clock className="w-6 h-6 text-emerald-400" /> Analysis & Optimization Progress Timeline
            </h3>
            <span className="text-xs text-slate-400 hidden sm:inline-block">Click any step to update progress status</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {timeline.map((item, index) => {
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

        {/* 2. Feedback Grid (Strengths & Weaknesses) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strengths Card */}
          <motion.div variants={cardSlideIn} className="bg-slate-900/60 p-8 rounded-3xl border border-emerald-500/20 backdrop-blur-xl shadow-xl">
            <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-3 mb-6 border-b pb-4 border-slate-800">
              <UserCheck className="w-6 h-6 text-emerald-400" /> Key Resume Strengths
            </h3>
            <ul className="space-y-3">
              {analysisData.insights.strengths.map((insight) => (
                <li key={insight.id} className="flex gap-3 text-slate-300 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl items-start text-sm">
                  <Star className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{insight.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Weaknesses/Alert Card */}
          <motion.div variants={cardSlideIn} className="bg-slate-900/60 p-8 rounded-3xl border border-red-500/20 backdrop-blur-xl shadow-xl">
            <h3 className="text-xl font-bold text-red-400 flex items-center gap-3 mb-6 border-b pb-4 border-slate-800">
              <AlertTriangle className="w-6 h-6 text-red-400" /> Actionable Improvements
            </h3>
            <ul className="space-y-4">
              {analysisData.insights.weaknesses.map((item) => (
                <li key={item.id} className="flex gap-3 text-slate-300 p-4 rounded-2xl bg-slate-950/60 border border-red-500/20 shadow-sm items-start">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-white text-base">{item.title}</p>
                    <p className="text-slate-400 text-xs mt-1">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* 3. Skill & Knowledge Gaps */}
        <motion.div variants={cardSlideIn} className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl">
          <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
            <BrainCircuit className="w-6 h-6 text-emerald-400" /> Skill Knowledge Gaps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-[1fr,1.3fr] gap-8">
            {/* Detected Skills */}
            <div className="p-6 bg-slate-950/60 rounded-2xl border border-slate-800">
              <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Detected Skills</p>
              <div className="flex flex-wrap gap-2.5">
                {analysisData.skills.detected.map((skill) => (
                  <span key={skill} className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            {/* Missing Skills */}
            <div className="p-6 bg-amber-500/5 rounded-2xl border border-amber-500/20">
              <p className="text-xs font-semibold text-amber-400 mb-3 uppercase tracking-wider">Strongly Recommended Skills to Add</p>
              <div className="flex flex-wrap gap-2.5">
                {analysisData.skills.suggested.map((skill) => (
                  <span key={skill} className="px-3.5 py-1.5 bg-amber-500/10 text-amber-300 font-bold rounded-full text-xs border border-amber-500/30">
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. Recommendations and Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recommended Learning */}
          <motion.div variants={cardSlideIn} className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6 border-b pb-4 border-slate-800">
              <BookOpen className="w-6 h-6 text-emerald-400" /> Personalized Learning Roadmap
            </h3>
            <div className="space-y-4">
              {analysisData.learningRoadmap.map((course, i) => (
                <motion.a 
                  whileHover={{ y: -2, scale: 1.01 }}
                  key={i} href="#" target="_blank" className="block p-5 bg-slate-950/60 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition group"
                >
                  <p className="font-semibold text-slate-200 group-hover:text-emerald-400 text-sm transition">{course.title}</p>
                  <p className="text-xs text-emerald-400 font-medium mt-1">{course.platform}</p>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Suitable Job Roles */}
          <motion.div variants={cardSlideIn} className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6 border-b pb-4 border-slate-800">
              <Briefcase className="w-6 h-6 text-emerald-400" /> Optimized Job Target
            </h3>
            <div className="space-y-4">
              {analysisData.matchedJobs.map((job, i) => {
                const jobScoreColor = job.match >= 85 ? 'text-emerald-400' : job.match >= 70 ? 'text-amber-400' : 'text-red-400';
                return (
                  <div key={i} className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-base text-white">{job.title}</p>
                      <p className="text-xs text-slate-400 mt-1">Gap: {job.missing.join(", ")}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{job.location}</p>
                    </div>
                    <div className={`text-3xl font-black ${jobScoreColor}`}>
                      {job.match}%
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}