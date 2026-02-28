'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// 1. Define your database of available ROOT files here
const GEOMETRIES = [
  { id: 'hibeam', name: 'HIBEAM Detector', filename: 'hibeam.root' },
  { id: 'krakow', name: 'Detector Arrangement at Krakow IFJ', filename: 'krakow.root' },
  { id: 'prototpc', name: 'The Prototype TPC', filename: 'prototpc.root' }
];

export default function HibeamProjectPage() {
  // 2. State to track the currently active geometry (defaults to the first one)
  const [activeGeo, setActiveGeo] = useState(GEOMETRIES[0]);

  return (
    <main className="min-h-screen flex flex-col pt-24 px-6">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full mb-8">
        <Link href="/projects/hibeam" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to HIBEAM
        </Link>
        <h1 className="text-4xl font-bold text-white mt-6">HIBEAM Detector Geometry</h1>
        <p className="text-zinc-400 mt-2">Select a configuration to view the native ROOT simulation.</p>
      </div>

      {/* 3. The Interactive UI Controls */}
      <div className="max-w-7xl mx-auto w-full mb-6 flex flex-wrap gap-4">
        {GEOMETRIES.map((geo) => (
          <button
            key={geo.id}
            onClick={() => setActiveGeo(geo)}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeGeo.id === geo.id 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : 'bg-zinc-900 text-zinc-400 border border-white/10 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            {geo.name}
          </button>
        ))}
      </div>

      {/* 4. The Iframe Sandbox */}
      <div className="w-full max-w-7xl mx-auto h-[600px] bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden relative">
        <iframe
          // The 'key' forces React to completely destroy and recreate the iframe when the file changes. 
          // This prevents JSROOT from hoarding memory and crashing the browser!
          key={activeGeo.id} 
          
          // Pass the filename via the URL parameter
          src={`/viewer.html?file=${activeGeo.filename}`}
          
          title="CERN JSROOT Viewer"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

    </main>
  );
}