'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Award, Clock, FileCheck } from 'lucide-react';

interface UserProfileTimelineProps {
  user: any;
  history?: Array<{
    id: string;
    date: string;
    resumeName: string;
    atsScore: number;
    targetRole: string;
    status: string;
  }>;
}

// Sample history mock data if empty
const defaultHistory = [
  {
    id: '1',
    date: '2026-07-28',
    resumeName: 'Frontend_Developer_Resume.pdf',
    atsScore: 78,
    targetRole: 'Senior React Developer',
    status: 'Improved +12%'
  },
  {
    id: '2',
    date: '2026-06-15',
    resumeName: 'FullStack_Engineer_V2.pdf',
    atsScore: 66,
    targetRole: 'Full Stack Engineer',
    status: 'Initial Scan'
  }
];

export default function UserProfileTimeline({ user, history = defaultHistory }: UserProfileTimelineProps) {
  const userEmail = user?.email || 'user@example.com';
  const userName = user?.user_metadata?.full_name || userEmail.split('@')[0];

  return (
    <div className="space-y-8 text-white">
      {/* User Header Profile Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center font-extrabold text-slate-950 text-2xl shadow-lg shadow-emerald-500/20">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{userName}</h2>
            <p className="text-xs text-slate-400">{userEmail}</p>
            <span className="inline-block mt-2 px-3 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-semibold">
              Pro Member
            </span>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-8">
          <div className="text-center">
            <span className="text-2xl font-bold text-emerald-400">78%</span>
            <span className="block text-[11px] text-slate-400 font-medium">Best ATS Score</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-cyan-400">2</span>
            <span className="block text-[11px] text-slate-400 font-medium">Resumes Scanned</span>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Career Progress Timeline
            </h3>
            <p className="text-xs text-slate-400">Track your resume improvements over time</p>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="relative border-l-2 border-slate-800 ml-4 space-y-8">
          {history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative pl-6 group"
            >
              {/* Timeline Bullet */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-emerald-400 group-hover:scale-125 transition" />

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" /> {item.date}
                  </div>
                  <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" /> {item.resumeName}
                  </h4>
                  <p className="text-xs text-slate-400">Target Role: <strong className="text-slate-200">{item.targetRole}</strong></p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                    {item.status}
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-emerald-400">{item.atsScore}%</span>
                    <span className="block text-[10px] text-slate-400">ATS Match</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}