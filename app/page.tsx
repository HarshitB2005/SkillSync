'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FileUploader from '../components/FileUploader';
import LoadingState from '../components/LoadingState';
import Dashboard from '../components/Dashboard';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsLoading(true);

    // Simulate API call loading time (3 seconds)
    setTimeout(() => {
      setIsLoading(false);
      setIsAnalyzed(true);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden">
      {/* Decorative Background Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        {/* Animated Hero Section (Only shows before analysis finishes) */}
        {!isAnalyzed && (
          <header className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 text-blue-700 font-semibold text-xs mb-6 border border-blue-200 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Next-Gen AI Resume Intelligence</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
            >
              Optimize Your Resume for <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ATS Algorithms & Top Employers
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Get instant ATS scores, identify critical skill gaps, receive customized online course suggestions, and discover job roles that match your strengths.
            </motion.p>
          </header>
        )}

        {/* Main Content View Switcher */}
        <div className="max-w-3xl mx-auto">
          {!isAnalyzed && !isLoading && (
            <FileUploader onFileUpload={handleFileUpload} />
          )}

          {isLoading && <LoadingState />}

          {isAnalyzed && (
            <div>
              {/* Optional Reset Button to go back to upload */}
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => {
                    setIsAnalyzed(false);
                    setFile(null);
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl transition flex items-center gap-2"
                >
                  Upload Another Resume <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <Dashboard />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}