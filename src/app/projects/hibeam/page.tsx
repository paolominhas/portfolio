'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function HibeamProjectPage() {
  return (
    <main className="min-h-screen flex flex-col bg-zinc-950 pt-24 px-6">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full mb-8">
        <Link href="/projects" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
        </Link>
        <h1 className="text-4xl font-bold text-white mt-6">HIBEAM Detector Geometry</h1>
        <p className="text-zinc-400 mt-2">Native ROOT geometry running in an isolated browser sandbox.</p>
      </div>

      {/* The Iframe Sandbox */}
      <div className="w-full max-w-7xl mx-auto h-[600px] bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden relative">
        <iframe
          src="/viewer.html"
          title="CERN JSROOT Viewer"
          className="w-full h-full border-none"
          // This allows the iframe to run JS and load the same-origin .root file safely
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

    </main>
  );
}