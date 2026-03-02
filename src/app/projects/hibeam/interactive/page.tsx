'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Target } from 'lucide-react';

// 1. The Expanded Database
// Now includes images, short summaries for the top, and deep-dive technical specs for the bottom.
const GEOMETRIES = [
  { 
    id: 'hibeam', 
    name: 'Proposed HIBEAM Detector', 
    filename: 'hibeam.root',
    icon: <Target className="w-4 h-4 mr-2" />,
    image: '/images/hibeam.png', // Place this in your /public folder!
    summary: 'The detector planned for the HIBEAM experiment at the ESS. Click to zoom, drag the detector around and hover over components for more details (properties of the objects in ROOT such as name, material and position).',
    details: 'This is the full detector planned at the ESS in the future. It was not the subject of this project but we can look at it in comparison to the prototype. They are of similar sizes - the TPCs would both be able to fit on a desk, and made of similar materials (argon gas mixture). The key difference is all of the extra material around the TPC. We can see the rounded cube TPC in the centre, with a larger cube around it. This material around the TPC is called a "cosmic veto", and will massively reduce the cosmic muon radiation mentioned in the previous section (the most persisent background effect in this experiment that reduces the quality of our data). The detector will be detecting neutrons that have collided witha rotating tungsten target. This neutron beam is difficult to work with as neutrons have no charge so we cannot guide them with magnets like protons.',
    specs: ['Beam Target: Neutrons on Rotating Tungsten', 'Tracking: TPC', '"Cosmic Veto": Plastic Scintillator Modules']
  },
  { 
    id: 'krakow', 
    name: 'Krakow Proton Beam Arrangement', 
    filename: 'krakow.root',
    icon: <Target className="w-4 h-4 mr-2" />,
    image: '/images/krakow.png',
    summary: 'The proton beam arrangement with the prototype as we used at the Institute of Nuclear Physics (IFJ) in Krakow. Click to zoom, drag the detector around and hover over components for more details (properties of the objects in ROOT such as name, material and position).',
    details: 'At Krakow, you can see the main cylindrical beampipe pointing towards a very thin target (made of deuteron). When the beam collides with this target, protons scatter in all directions, with a small proportion hitting our detector. There are scintillators behind the detector too: these emit a flash of light if a particle passes through them, and can be used in conjunction with the time projection chamber detector to confirm if particles have passes through the detectors. Our TPC does not actually know when an "event" (a proton passing through) occurs, but the scintillators do, so we use them to tell the TPC what is important or not. There are also scintillators on the opposite side to the main detector, and these are used to check for the other particles that would be present from the scattering with the target. This is called a coincidence measurement.',
    specs: ['Setup: Proton Beam', 'Detectors: Prototype TPC, Scintillators', 'Runs: Scintillators were rotated to test different angles']
  },
  { 
    id: 'prototpc', 
    name: 'Prototype Time Projection Chamber Only', 
    filename: 'prototpc.root',
    icon: <Target className="w-4 h-4 mr-2" />,
    image: '/images/proto.png',
    summary: 'The prototype detector isolated so we can look at how it detects protons and muons alone. Click to zoom, drag the detector around and hover over components for more details (properties of the objects in ROOT such as name, material and position).',
    details: 'The sensitive area of the cuboid in the centre represents the part of the detector we can take readings in. We can measure the energy the incoming particles transfer to our detector at given points, as well as the position of these particles. The plates above and below are scintillators (they emit a flash of light when particles pass through them so we can see if particles pass through multiple sheets).',
    specs: ['Detector Material: Argon Gas Mixture', 'Magnetic Field: None']
  }
];

export default function HibeamProjectPage() {
  const [activeGeo, setActiveGeo] = useState(GEOMETRIES[0]);

  return (
    <main className="min-h-screen flex flex-col pt-24 px-4 md:px-8 pb-20 bg-[#030712] text-zinc-300 font-sans">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto w-full mb-8">
        <Link href="/projects/hibeam" className="inline-flex items-center text-cyan-500 hover:text-cyan-400 font-medium transition-colors text-sm uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Project
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-tight">
          Interact with the Detectors!
        </h1>
        <p className="text-zinc-400 mt-2 text-lg">The different detector setups we simulated in this project</p>
      </div>

      {/* DYNAMIC SELECTION CONTROLS */}
      <div className="max-w-6xl mx-auto w-full mb-10 flex flex-wrap gap-3 border-b border-zinc-800 pb-8">
        {GEOMETRIES.map((geo) => (
          <button
            key={geo.id}
            onClick={() => setActiveGeo(geo)}
            className={`flex items-center px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              activeGeo.id === geo.id 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300'
            }`}
          >
            {geo.icon}
            {geo.name}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* TOP DESCRIPTION (Left Column) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col justify-center">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-zinc-800/50 border border-zinc-700 w-fit">
            <span className="text-xs font-mono text-zinc-400">FILE: {activeGeo.filename}</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">{activeGeo.name}</h2>
          <p className="text-xl text-zinc-400 leading-relaxed border-l-2 border-cyan-500 pl-4">
            {activeGeo.summary}
          </p>
        </div>

        {/* IMAGE PLACEHOLDER (Right Column) */}
        <div className="col-span-1 h-64 lg:h-auto min-h-[250px] relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
          <img 
            // The 'key' forces the image to fade in cleanly when swapped
            key={`img-${activeGeo.id}`}
            src={activeGeo.image} 
            alt={`Simulation render of ${activeGeo.name}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            // Fallback just in case the image hasn't been uploaded yet
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/600x400/09090b/22d3ee?text=Render+Missing';
            }}
          />
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Interactions in Detector</span>
          </div>
        </div>

      </div>

      {/* THE 3D ROOT VIEWER */}
      <div className="w-full max-w-6xl mx-auto h-[600px] bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden relative shadow-2xl mb-12">
        <iframe
          key={`iframe-${activeGeo.id}`} 
          src={`/viewer.html?file=${activeGeo.filename}`}
          title="CERN JSROOT Viewer"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      {/* BOTTOM TECHNICAL DESCRIPTION */}
      <div className="max-w-6xl mx-auto w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">About this detector</h3>
          <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
            {activeGeo.details}
          </p>
        </div>
        
        {/* Technical Specs List */}
        <div className="md:w-1/3 bg-black/40 p-6 rounded-xl border border-zinc-800/50">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Technical Specifications</h4>
          <ul className="space-y-3">
            {activeGeo.specs.map((spec, i) => {
              const [title, value] = spec.split(': ');
              return (
                <li key={i} className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{title}</span>
                  <span className="text-sm text-zinc-300 font-medium">{value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

    </main>
  );
}