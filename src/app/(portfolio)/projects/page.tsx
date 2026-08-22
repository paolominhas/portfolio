'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/projects'; // Import your data

export default function ProjectsIndex() {
  return (
    <section className="pt-32 px-6 md:px-20 max-w-7xl mx-auto pb-24">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
        Selected Projects
      </h1>
      <p className="text-zinc-400 max-w-2xl mb-12">
        Physics research, freelance web development, and the design/production
        work that comes with running a student orchestra — a mix of code and
        everything around it.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => {
          const isExternal = Boolean(project.external);
          const href = isExternal ? project.external! : `/projects/${project.slug}`;

          return (
            <Link
              key={project.id}
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="group relative block bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300"
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="p-8 relative z-10">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="text-xs font-mono text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {isExternal && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      physics.paolo.org.uk <ArrowUpRight size={12} />
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                  {project.title}
                </h2>

                <p className="text-zinc-400 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
