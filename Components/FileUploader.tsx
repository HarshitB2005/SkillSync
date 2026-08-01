'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, FileCheck2 } from 'lucide-react';

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
      {/* Upload Box Container with Cyber Emerald Glow */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="relative group rounded-3xl p-1 bg-gradient-to-r from-emerald-500/40 via-cyan-500/30 to-teal-500/40 backdrop-blur-xl shadow-2xl shadow-emerald-950/50"
      >
        <div className="bg-slate-950/80 backdrop-blur-md rounded-[22px] p-6 md:p-8 text-center border border-emerald-500/20">
          {/* Main Drop Area */}
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
              isDragActive
                ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                : 'border-slate-700 hover:border-cyan-400 hover:bg-slate-900/60'
            }`}
          >
            <input {...getInputProps()} />

            {/* Animated Icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-400/40 rounded-2xl flex items-center justify-center mb-4 text-emerald-400 shadow-lg shadow-emerald-500/10"
            >
              <UploadCloud className="w-8 h-8" />
            </motion.div>

            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
              {isDragActive ? 'Drop your resume here' : 'Upload Your Resume'}
            </h3>
            <p className="text-slate-400 max-w-sm text-xs mb-5 font-normal">
              Drag & drop your resume (PDF or DOCX) to launch AI analysis.
            </p>

            {/* Format Badges */}
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-900 text-slate-200 font-semibold rounded-full text-xs flex items-center gap-1 border border-emerald-500/20">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" /> PDF
              </span>
              <span className="px-3 py-1 bg-slate-900 text-slate-200 font-semibold rounded-full text-xs flex items-center gap-1 border border-emerald-500/20">
                <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" /> DOCX
              </span>
            </div>
          </div>

          {/* Selected File Banner */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-emerald-400 w-5 h-5" />
                  <div>
                    <p className="font-semibold text-white text-xs">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" /> Ready
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}