'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, Sparkles, ShieldCheck, FileCheck2 } from 'lucide-react';

interface Props {
  onFileUpload: (file: File) => void;
}

export default function FileUploader({ onFileUpload }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        onFileUpload(acceptedFiles[0]);
      }
    },
  });

  return (
    <div className="w-full">
      {/* Upload Box Container with Glow Effect */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="relative group rounded-3xl p-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-2xl"
      >
        <div className="bg-white rounded-[22px] p-8 md:p-12 text-center">
          {/* Main Drop Area */}
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
              isDragActive
                ? 'border-blue-500 bg-blue-50/60 scale-[1.01]'
                : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'
            }`}
          >
            <input {...getInputProps()} />

            {/* Floating Animated Icon */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner text-blue-600"
            >
              <UploadCloud className="w-10 h-10" />
            </motion.div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {isDragActive ? 'Drop your file here now' : 'Drag & Drop your Resume'}
            </h3>
            <p className="text-slate-500 max-w-sm text-sm mb-6">
              Upload your resume in PDF or DOCX format to analyze your ATS match score instantly.
            </p>

            {/* Format Chips */}
            <div className="flex gap-3">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 font-semibold rounded-full text-xs flex items-center gap-1.5 border border-slate-200">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-500" /> PDF
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 font-semibold rounded-full text-xs flex items-center gap-1.5 border border-slate-200">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-500" /> DOCX
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 font-semibold rounded-full text-xs flex items-center gap-1.5 border border-slate-200">
                Max 5MB
              </span>
            </div>
          </div>

          {/* File Selected Notification Banner */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-emerald-600 w-6 h-6" />
                  <div className="text-left">
                    <p className="font-semibold text-slate-800 text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Ready for AI Analysis
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Trust & Feature Badges Below Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
      >
        <div className="p-4 bg-white/80 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm text-slate-800">AI Powered</p>
            <p className="text-xs text-slate-500">Instant ATS parsing</p>
          </div>
        </div>

        <div className="p-4 bg-white/80 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm text-slate-800">100% Private</p>
            <p className="text-xs text-slate-500">Data strictly secure</p>
          </div>
        </div>

        <div className="p-4 bg-white/80 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-purple-100 rounded-xl text-purple-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm text-slate-800">Smart Guidance</p>
            <p className="text-xs text-slate-500">Courses & job matching</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}