import { articles } from '@/data/articles';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image'; // Assuming you are using Next.js Image optimization

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const article = articles.find((p) => p.slug === slug);

  if (!article) {
    notFound(); 
  }

  return (
    // Background gradient adds a subtle, premium "glass" feel behind the academic text
    <article className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950 pt-32 pb-32 px-6 sm:px-12 selection:bg-cyan-500/30">
      
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation */}
        <Link 
          href="/articles" 
          className="group inline-flex items-center text-xs font-bold uppercase tracking-widest text-cyan-500 hover:text-cyan-400 mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> 
          Return to Archive
        </Link>

        {/* Academic Header */}
        <header className="mb-12 font-sans">
          <p className="text-slate-500 uppercase tracking-widest text-xs font-bold mb-4">
            Research Article
          </p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight text-white mb-6">
            {article.title}
          </h1>
          
          {/* Mocked Author/Institution Metadata (Standard for Journals) */}
          <div className="text-lg text-cyan-100 mb-2">
            Paolo Minhas<sup>1*</sup>
          </div>
          <div className="text-sm text-slate-400 leading-relaxed mb-8">
            <sup>1</sup> Department of Physics, University of Edinburgh, Edinburgh, United Kingdom. <br />
            <sup>*</sup> e-mail: info@paolo.org.uk
          </div>

          {/* Tech Stack / Keywords */}
          <div className="flex flex-wrap gap-2 border-y border-white/10 py-4">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mr-2 self-center">Keywords:</span>
            {article.techStack.map(t => (
                <span key={t} className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-xs font-mono text-cyan-400">
                    {t}
                </span>
            ))}
          </div>
        </header>

        {/* Hero Image / Figure 1 */}
        {article.image && (
          <figure className="mb-16 relative">
            <div className="w-full aspect-video md:aspect-[21/9] relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              {/* If you get domain errors, swap <Image> for a standard <img> tag */}
              <img 
                src={article.image} 
                alt={`Header visual for ${article.title}`}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
            </div>
            <figcaption className="mt-4 text-xs text-slate-500 font-sans border-l-2 border-cyan-500 pl-3">
              <strong className="text-slate-300">Figure 1 | </strong> Visualization associated with the primary dataset of the {article.title} study.
            </figcaption>
          </figure>
        )}

        {/* Main 2-Column Academic Body */}
        {/* Note the complex arbitrary variants ([&>...]) - these target the raw HTML injected by your CMS/Data file */}
        <div 
          className="
            prose prose-invert prose-lg max-w-none font-serif text-slate-300 text-justify leading-relaxed
            md:columns-2 md:gap-12
            
            /* Structural Rules to prevent ugly column breaks */
            prose-p:break-inside-avoid-column
            prose-headings:font-sans prose-headings:text-white prose-headings:break-after-avoid-column
            
            /* Forces Headings to span across both columns so the text flows under them! */
            [&>h1]:[column-span:all] [&>h2]:[column-span:all] [&>h3]:[column-span:all]
            
            /* The 'Nature' Drop Cap: Targets only the very first paragraph in the HTML */
            [&>p:first-of-type]:first-letter:text-6xl 
            [&>p:first-of-type]:first-letter:font-bold 
            [&>p:first-of-type]:first-letter:text-cyan-400 
            [&>p:first-of-type]:first-letter:float-left 
            [&>p:first-of-type]:first-letter:mr-4 
            [&>p:first-of-type]:first-letter:mt-2 
            [&>p:first-of-type]:first-letter:font-sans
            
            /* Customizing Lists and Links */
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
            prose-li:marker:text-cyan-500
          "
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
        
      </div>
    </article>
  );
}