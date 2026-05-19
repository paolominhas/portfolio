import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function WebHomePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans selection:bg-rose-200 selection:text-stone-900">
      
      {/* Minimalist, Sharp Navigation */}
      <header className="flex items-center justify-between p-6 md:p-8 w-full uppercase tracking-widest text-xs font-semibold z-10 relative">
        <Link href="/" className="hover:text-rose-500 transition-colors">
          paolo.org.uk
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/portfolio" className="hover:text-rose-500 transition-colors">Portfolio of Websites</Link>
          <Link href="/tutorials" className="hover:text-sky-500 transition-colors">Tutorials</Link>
          <Link href="https://paolo.org.uk/contact" className="hover:text-emerald-500 transition-colors">Contact</Link>
        </nav>
      </header>

      {/* Editorial Hero Section */}
      <section className="px-6 py-20 md:py-32 max-w-5xl mx-auto text-center flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-stone-800 mb-6 leading-tight">
          Building websites with <br className="hidden md:block" />
          <span className="italic text-rose-400">physics</span> and style.
        </h1>
        <p className="text-lg md:text-xl text-stone-500 max-w-2xl font-light">
          Which has to said can often be a rare combination. Send me a message if you do not agree with the style comment.
        </p>
      </section>

      {/* The Sharp 4-Image Grid 
        - No gaps (gap-0)
        - No rounded corners (rounded-none)
        - Full bleed (w-full)
      */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 bg-stone-200">
        
        {/* Image 1: Pastel Pink/Warm */}
        <div className="relative aspect-square md:aspect-[4/3] bg-rose-100 overflow-hidden group">
          <img
            src="https://paolo.org.uk/images/eucosite.png"
            alt="The homepage of the Edinburgh University Chamber Orchestra website"
            className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Subtle hover overlay text */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <span className="text-white uppercase tracking-widest text-sm font-medium">
              <Link href="/" className="hover:text-rose-500 transition-colors">
                View My Portfolio of Websites
              </Link>
            </span>
          </div>
        </div>

        {/* Image 2: Bright Color Pop / Abstract */}
        <div className="relative aspect-square md:aspect-[4/3] bg-rose-100 overflow-hidden group">
          <img
            src="https://paolo.org.uk/images/eucosite.png"
            alt="The homepage of the Edinburgh University Chamber Orchestra website"
            className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Subtle hover overlay text */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <span className="text-white uppercase tracking-widest text-sm font-medium">
              <Link href="/" className="hover:text-rose-500 transition-colors">
                View My Portfolio of Websites
              </Link>
            </span>
          </div>
        </div>

        {/* Image 3: Minimalist Green/Nature offset */}
        <div className="relative aspect-square md:aspect-[4/3] bg-rose-100 overflow-hidden group">
          <img
            src="https://paolo.org.uk/images/eucosite.png"
            alt="The homepage of the Edinburgh University Chamber Orchestra website"
            className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Subtle hover overlay text */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <span className="text-white uppercase tracking-widest text-sm font-medium">
              <Link href="/" className="hover:text-rose-500 transition-colors">
                View My Portfolio of Websites
              </Link>
            </span>
          </div>
        </div>

        {/* Image 4: Minimalist Green/Nature offset */}
        <div className="relative aspect-square md:aspect-[4/3] bg-rose-100 overflow-hidden group">
          <img
            src="https://paolo.org.uk/images/eucosite.png"
            alt="The homepage of the Edinburgh University Chamber Orchestra website"
            className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Subtle hover overlay text */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <span className="text-white uppercase tracking-widest text-sm font-medium">
              <Link href="/" className="hover:text-rose-500 transition-colors">
                View My Portfolio of Websites
              </Link>
            </span>
          </div>
        </div>

      </section>

      {/* Simple Footer */}
      <footer className="w-full p-8 md:p-12 flex justify-between items-center text-xs uppercase tracking-widest text-stone-400">
        <span>© {new Date().getFullYear()} PM</span>
        <span className="text-stone-900">Based in Edinburgh</span>
      </footer>

    </div>
  );
}