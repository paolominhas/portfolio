import Link from 'next/link';
import { projects } from '@/data/projects'; // Import your data

export default function ProjectsIndex() {
  return (
    <section className="pt-32 px-6 md:px-20 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
        Selected Projects
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Link 
            key={project.id} 
            href={`/projects/${project.slug}`} // Links to the dynamic page
            className="group relative block bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="p-8 relative z-10">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech) => (
                  <span key={tech} className="text-xs font-mono text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              
              <h2 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                {project.title}
              </h2>
              
              <p className="text-zinc-400 line-clamp-2">
                {project.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}