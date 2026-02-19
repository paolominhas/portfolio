import Image from 'next/image';

export default function AboutPage() {
  return (
    <section className="pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Image & Quick Stats */}
        <div className="space-y-8">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
                {/* Save your photo as public/me.jpg */}
                <Image 
                    src="/me.jpg" 
                    alt="Profile Picture" 
                    fill 
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                />
            </div>

            {/* Tech Stack Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                    <h3 className="text-zinc-400 text-sm mb-1">Location</h3>
                    <p className="font-semibold text-white">San Francisco, CA</p>
                </div>
                <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                    <h3 className="text-zinc-400 text-sm mb-1">Experience</h3>
                    <p className="font-semibold text-white">5+ Years</p>
                </div>
            </div>
        </div>

        {/* Right Column: Narrative & Details */}
        <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                About Me.
            </h1>
            
            <div className="prose prose-invert prose-lg text-zinc-300">
                <p>
                    I am a software engineer driven by the intersection of design and logic. 
                    I don't just write code; I build systems that scale and interfaces that feel alive.
                </p>
                <p>
                    My journey started with C++ in competitive programming, moving into the modern 
                    web ecosystem with React and Node.js. I believe in **Type Safety**, **Clean Architecture**, 
                    and **User-Centric Design**.
                </p>
            </div>

            {/* Skills Section */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Technical Arsenal</h2>
                <div className="flex flex-wrap gap-2">
                    {['TypeScript', 'Next.js', 'Node.js', 'React Three Fiber', 'PostgreSQL', 'Docker', 'AWS', 'Tailwind'].map((skill) => (
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
                        <h3 className="text-lg font-semibold text-white">Senior Engineer @ TechCorp</h3>
                        <p className="text-zinc-500 text-sm mb-2">2021 - Present</p>
                        <p className="text-zinc-400">Leading the migration to a micro-frontend architecture.</p>
                    </div>
                    {/* Item 2 */}
                    <div className="relative">
                        <div className="absolute -left-[29px] top-1 w-3 h-3 bg-zinc-800 rounded-full border-4 border-zinc-950" />
                        <h3 className="text-lg font-semibold text-white">Full Stack Dev @ StartUp Inc</h3>
                        <p className="text-zinc-500 text-sm mb-2">2018 - 2021</p>
                        <p className="text-zinc-400">Built the MVP from scratch using MERN stack.</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}