import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <section className="pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Image & Quick Stats */}
        <div className="space-y-8">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
                {/* Save your photo as public/me.jpg */}
                <Image 
                    src="/images/me.jpg" 
                    alt="Profile Picture" 
                    fill 
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                />
            </div>

            {/* Tech Stack Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                    <h3 className="text-zinc-400 text-sm mb-1">Location</h3>
                    <p className="font-semibold text-white">Edinburgh, UK</p>
                </div>
                <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                    <h3 className="text-zinc-400 text-sm mb-1">Degree Subject</h3>
                    <p className="font-semibold text-white">Physics (Particle Physics)</p>
                </div>
            </div>
        </div>

        {/* Right Column: Narrative & Details */}
        <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                About Me
            </h1>
            
            <div className="prose prose-invert prose-lg text-zinc-300">
                <p>
                    Hello, I am a student finishing up the last year of my integrated Master's in Physics in Edinburgh. 
                    I have also tried out a bit of coding here and there and recently started trying out websites and JavaScript.
                </p>
                <p>
                    I love music, and recently was lucky enough to get the opportunity to make a website for my orchestra.
                    You can see this website here:
                </p>
            </div>

            <div className="max-w-7xl mx-auto w-full mb-8">                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6">
                    <div>
                        <h1 className="text-2l font-bold text-white">Edinburgh Universty Chamber Orchestra</h1>
                        <p className="text-zinc-400 mt-2">You can also buy tickets for their upcoming concerts!</p>
                    </div>
                    
                    <a 
                        href="https://eu-co.co.uk" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center shrink-0 px-6 py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-colors"
                    >
                        Visit EUCO Site
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full mb-8">                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6">
                    <a 
                        href="https://github.com/paolominhas/EUCO-Website" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center shrink-0 px-6 py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-colors"
                    >
                        Visit eu-co.co.uk GitHub repo
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                    <a 
                        href="https://github.com/paolominhas/portfolio" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center shrink-0 px-6 py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-colors"
                    >
                        Visit this site's GitHub repo
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                </div>
            </div>
           


            {/* Skills Section */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">My Coding Experience</h2>
                <div className="flex flex-wrap gap-2">
                    {['python', 'C++', 'ROOT', 'geant4', 'TypeScript', 'Next.js', 'React.js', 'JavaScript', 'Tailwind', 'GLoBES'].map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

             {/* Experience "Timeline" */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Experience</h2>
                <div className="space-y-6 border-l border-zinc-800 pl-6 relative">
                    {/* Item 1 */}
                    <div className="relative">
                        <div className="absolute -left-[29px] top-1 w-3 h-3 bg-zinc-500 rounded-full border-4 border-zinc-950" />
                        <h3 className="text-lg font-semibold text-white">Student @ University of Edinburgh</h3>
                        <p className="text-zinc-500 text-sm mb-2">2022 - 2026</p>
                        <p className="text-zinc-400">Master's in Physics with direct entry</p>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-[29px] top-1 w-3 h-3 bg-zinc-800 rounded-full border-4 border-zinc-950" />
                        <h3 className="text-lg font-semibold text-white">Intern Researcher @ IFJ PAN Kraków, PL</h3>
                        <p className="text-zinc-500 text-sm mb-2">2025</p>
                        <p className="text-zinc-400">Energy fitting with ML in ROOT and python for charmed lambda baryon decays (LHCb)</p>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-[29px] top-1 w-3 h-3 bg-zinc-800 rounded-full border-4 border-zinc-950" />
                        <h3 className="text-lg font-semibold text-white">Summer Researcher @ University of Edinburgh, UK</h3>
                        <p className="text-zinc-500 text-sm mb-2">2025</p>
                        <p className="text-zinc-400">Simulating the effect of the sterile neutrino on sensitivity of the DUNE detectors</p>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-[29px] top-1 w-3 h-3 bg-zinc-800 rounded-full border-4 border-zinc-950" />
                        <h3 className="text-lg font-semibold text-white">Front of House @ Edinburgh Playhouse</h3>
                        <p className="text-zinc-500 text-sm mb-2">2024 - Present</p>
                        <p className="text-zinc-400">Probably should remove this from here but I also work as an usher and bartender</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}