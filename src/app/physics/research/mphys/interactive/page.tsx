'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Target } from 'lucide-react';

/**
 * Ported unchanged from the old portfolio route
 * (projects/hibeam/interactive/page.tsx) — same GEOMETRIES data, same
 * JSROOT iframe viewer. Only the surrounding chrome is recoloured
 * from the old ad hoc zinc/cyan palette to this site's abyss/ember
 * system, and the back-link now points at /research/mphys.
 */
const GEOMETRIES = [
  {
    id: 'hibeam',
    name: 'Proposed HIBEAM Detector',
    filename: 'hibeam.root',
    icon: <Target className="w-4 h-4 mr-2" />,
    image: '/images/hibeam.png',
    summary: 'The detector planned for the HIBEAM experiment at the ESS. Click to zoom, drag the detector around and hover over components for more details (properties of the objects in ROOT such as name, material and position).',
    details: 'This is the full detector planned at the ESS in the future. It was not the subject of this project but we can look at it in comparison to the prototype. They are of similar sizes - the TPCs would both be able to fit on a desk, and made of similar materials (argon gas mixture). The key difference is all of the extra material around the TPC. We can see the rounded cube TPC in the centre, with a larger cube around it. This material around the TPC is called a "cosmic veto", and will massively reduce the cosmic muon radiation mentioned in the previous section (the most persisent background effect in this experiment that reduces the quality of our data). The detector will be detecting neutrons that have collided witha rotating tungsten target. This neutron beam is difficult to work with as neutrons have no charge so we cannot guide them with magnets like protons',
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

export default function MphysInteractivePage() {
  const [activeGeo, setActiveGeo] = useState(GEOMETRIES[0]);

  return (
    <main className="min-h-screen flex flex-col pt-24 px-4 md:px-8 pb-20 bg-abyss bg-stars text-white/60 relative overflow-hidden">

      {/* HEADER */}
      <div className="relative max-w-6xl mx-auto w-full mb-8">
        <Link href="/research/mphys" className="inline-flex items-center text-[var(--accent)] hover:text-[var(--accent)]/80 font-medium transition-colors text-sm uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Project
        </Link>
        <h1 className="font-bodoni text-4xl md:text-5xl font-medium text-white mt-4 tracking-tight">
          Interact with the Detectors!
        </h1>
        <p className="text-white/40 mt-2 text-lg">The different detector setups we simulated in this project</p>
      </div>

      {/* DYNAMIC SELECTION CONTROLS */}
      <div className="relative max-w-6xl mx-auto w-full mb-10 flex flex-wrap gap-3 border-b border-white/10 pb-8">
        {GEOMETRIES.map((geo) => (
          <button
            key={geo.id}
            onClick={() => setActiveGeo(geo)}
            className={`flex items-center px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              activeGeo.id === geo.id
                ? 'bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent-border)] shadow-[0_0_15px_rgba(255,107,61,0.15)]'
                : 'bg-white/[0.03] text-white/40 border border-white/10 hover:bg-white/[0.06] hover:text-white/70'
            }`}
          >
            {geo.icon}
            {geo.name}
          </button>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

        {/* TOP DESCRIPTION (Left Column) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col justify-center">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/[0.04] border border-white/10 w-fit">
            <span className="text-xs font-mono text-white/40">FILE: {activeGeo.filename}</span>
          </div>
          <h2 className="font-bodoni text-3xl font-medium text-white mb-4">{activeGeo.name}</h2>
          <p className="text-xl text-white/50 leading-relaxed border-l-2 border-[var(--accent)] pl-4">
            {activeGeo.summary}
          </p>
        </div>

        {/* IMAGE (Right Column) */}
        <div className="col-span-1 h-64 lg:h-auto min-h-[250px] relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] group">
          <img
            key={`img-${activeGeo.id}`}
            src={activeGeo.image}
            alt={`Simulation render of ${activeGeo.name}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/600x400/0A0E1A/FF6B3D?text=Render+Missing';
            }}
          />
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10">
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Interactions in Detector</span>
          </div>
        </div>

      </div>

      {/* THE 3D ROOT VIEWER */}
      <div className="relative w-full max-w-6xl mx-auto h-[600px] bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl mb-12">
        <iframe
          key={`iframe-${activeGeo.id}`}
          src={`/viewer.html?file=${activeGeo.filename}`}
          title="CERN JSROOT Viewer"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      {/* BOTTOM TECHNICAL DESCRIPTION */}
      <div className="relative max-w-6xl mx-auto w-full bg-white/[0.03] border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-[var(--accent)] uppercase tracking-widest mb-4">About this detector</h3>
          <p className="text-white/50 leading-relaxed text-sm md:text-base">
            {activeGeo.details}
          </p>
        </div>

        {/* Technical Specs List */}
        <div className="md:w-1/3 bg-black/30 p-6 rounded-xl border border-white/10">
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Technical Specifications</h4>
          <ul className="space-y-3">
            {activeGeo.specs.map((spec, i) => {
              const [title, value] = spec.split(': ');
              return (
                <li key={i} className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">{title}</span>
                  <span className="text-sm text-white/70 font-medium">{value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

    </main>
  );
}
