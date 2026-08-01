'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="bg-white p-12 rounded-xl shadow-md border border-slate-200 text-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
      <h3 className="text-xl font-bold text-slate-800">Analyzing Resume...</h3>
      <p className="text-slate-500 text-sm mt-2">
        Extracting text, evaluating ATS criteria, and matching online courses & target jobs.
      </p>
    </div>
  );
}