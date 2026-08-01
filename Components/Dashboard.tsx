'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, AlertTriangle, BookOpen, Briefcase, Zap, UserCheck, Star, BrainCircuit } from 'lucide-react';

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
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-amber-500';
  return 'text-red-600';
};

export default function Dashboard() {
  const scoreColor = getScoreColor(analysisData.atsScore);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-8"
    >
      {/* 1. Header & Main Score Gauge */}
      <motion.div variants={cardSlideIn} className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-8 bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
        <div className="flex flex-col justify-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mb-3">
            <Zap className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Resume Analysis Roadmap</h1>
          </motion.div>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
            We have generated an in-depth analysis of your resume against current industry standard ATS systems. Here is your personalized feedback and targeted job roadmap.
          </p>
        </div>
        
        {/* Animated Score Circle */}
        <motion.div 
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          className="relative w-40 h-40 flex items-center justify-center rounded-full bg-slate-50 border-8 border-slate-200"
        >
          <div className="text-center">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`text-6xl font-black ${scoreColor} tracking-tighter`}
            >
              {analysisData.atsScore}
            </motion.span>
            <p className="text-sm font-bold text-slate-400 mt-1">% ATS Score</p>
          </div>
        </motion.div>
      </motion.div>

      {/* 2. Feedback Grid (Strengths & Weaknesses) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths Card */}
        <motion.div variants={cardSlideIn} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 bg-green-50/20">
          <h3 className="text-2xl font-bold text-green-900 flex items-center gap-3 mb-6 border-b pb-4 border-green-100/50">
            <UserCheck className="w-7 h-7 text-green-600" /> Key Resume Strengths
          </h3>
          <ul className="space-y-3">
            {analysisData.insights.strengths.map((insight) => (
              <li key={insight.id} className="flex gap-3 text-slate-700 bg-green-100/30 p-4 rounded-xl items-start">
                <Star className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                <span>{insight.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Weaknesses/Alert Card */}
        <motion.div variants={cardSlideIn} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 bg-red-50/20">
          <h3 className="text-2xl font-bold text-red-900 flex items-center gap-3 mb-6 border-b pb-4 border-red-100/50">
            <AlertTriangle className="w-7 h-7 text-red-600" /> Actionable Improvements
          </h3>
          <ul className="space-y-4">
            {analysisData.insights.weaknesses.map((item) => (
              <li key={item.id} className="flex gap-3 text-slate-800 p-4 rounded-xl bg-white border border-red-100 shadow-sm items-start">
                <AlertTriangle className="w-6 h-6 text-red-500 mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 text-lg">{item.title}</p>
                  <p className="text-slate-600 text-sm">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* 3. Skill & Knowledge Gaps */}
      <motion.div variants={cardSlideIn} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6">
          <BrainCircuit className="w-7 h-7 text-blue-600" /> Skill Knowledge Gaps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-[1fr,1.3fr] gap-8">
          {/* Detected Skills */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm font-semibold text-slate-500 mb-3">Detected Skills</p>
            <div className="flex flex-wrap gap-2.5">
              {analysisData.skills.detected.map((skill) => (
                <span key={skill} className="px-4 py-1.5 bg-blue-100 text-blue-800 font-semibold rounded-full text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {/* Missing Skills */}
          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-sm font-semibold text-slate-500 mb-3">Strongly Recommended Skills to Add</p>
            <div className="flex flex-wrap gap-2.5">
              {analysisData.skills.suggested.map((skill) => (
                <span key={skill} className="px-4 py-1.5 bg-amber-100/50 text-amber-900 font-bold rounded-full text-xs border border-amber-200">
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
        <motion.div variants={cardSlideIn} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6 border-b pb-4 border-slate-100">
            <BookOpen className="w-7 h-7 text-blue-600" /> Personalized Learning Roadmap
          </h3>
          <div className="space-y-4">
            {analysisData.learningRoadmap.map((course, i) => (
              <motion.a 
                whileHover={{ y: -3, scale: 1.01 }}
                key={i} href="#" target="_blank" className="block p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition group"
              >
                <p className="font-semibold text-slate-900 group-hover:text-blue-700">{course.title}</p>
                <p className="text-sm text-blue-600 font-medium">{course.platform}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Suitable Job Roles */}
        <motion.div variants={cardSlideIn} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6 border-b pb-4 border-slate-100">
            <Briefcase className="w-7 h-7 text-blue-600" /> Optimized Job Target
          </h3>
          <div className="space-y-4">
            {analysisData.matchedJobs.map((job, i) => {
              const jobScoreColor = job.match >= 85 ? 'text-green-600' : job.match >= 70 ? 'text-amber-500' : 'text-red-600';
              return (
                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-lg text-slate-900">{job.title}</p>
                    <p className="text-sm text-slate-500">Gap: {job.missing.join(", ")}</p>
                    <p className="text-xs text-slate-400 mt-1">{job.location}</p>
                  </div>
                  <div className={`text-4xl font-extrabold ${jobScoreColor}`}>
                    {job.match}%
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}