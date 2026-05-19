import { musicPosts } from "@/data/music-posts";
import { notFound } from "next/navigation";
import MusicPostContent from "@/components/music/MusicPostContent";
import type { Metadata } from "next";

/**
 * DYNAMIC BLOG POST ROUTE
 *
 * URL: music.paolo.org.uk/posts/schumann-rhenish-analysis
 * Internal path: /music/posts/schumann-rhenish-analysis
 *
 * Looks up the post by slug, renders the HTML content, and
 * hydrates any VexFlow notation blocks found in the content.
 */

// Generate static params for build-time rendering
export function generateStaticParams() {
  return musicPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = musicPosts.find((p) => p.slug === params.slug);
  return {
    title: post?.title || "Post Not Found",
    description: post?.excerpt,
  };
}

export default function MusicPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = musicPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <article className="pt-32 pb-20 px-6 md:px-20 max-w-3xl mx-auto">
      <time className="text-sm text-zinc-600 font-mono">{post.date}</time>
      <h1 className="text-3xl md:text-5xl font-bold mt-2 mb-4 text-white">
        {post.title}
      </h1>
      <div className="flex flex-wrap gap-2 mb-10">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Content rendered as HTML + VexFlow hydration */}
      <MusicPostContent html={post.content} />
    </article>
  );
}
