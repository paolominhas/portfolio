// app/sitemap.xml/route.ts
import { projects } from '@/data/projects'; // Assuming this is where your data lives

// THIS IS THE MAGIC LINE: 
// It forces Next.js to render this file ONLY at build time, 
// creating a static XML file just like a standard sitemap.
export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = 'https://paolo.org.uk';

  // 1. Setup the XML with Google's specific Image and Video namespaces
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

  // 2. Add your static pages (Home, About, etc.)
  xml += `  <url>
    <loc>${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // 3. Loop through your projects and attach their media
  projects.forEach((project) => {
    xml += `  <url>
    <loc>${baseUrl}/projects/${project.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
`;

    // 4. Inject Image Tags (if the project has a cover image)
    if (project.image) {
      // Note: Google requires absolute URLs for images
      const imageUrl = project.image.startsWith('http') 
        ? project.image 
        : `${baseUrl}${project.image}`;

      xml += `    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${project.title}</image:title>
    </image:image>
`;
    }

    // 5. Inject Video Tags (if the project has a video)
    // Google STRICTLY requires thumbnail, title, description, and content_loc for videos.
    /*if (project.videoUrl) {
      const videoUrl = project.videoUrl.startsWith('http') 
        ? project.videoUrl 
        : `${baseUrl}${project.videoUrl}`;
        
      const thumbUrl = project.coverImage 
        ? `${baseUrl}${project.coverImage}` 
        : `${baseUrl}/default-video-thumbnail.jpg`;

      xml += `    <video:video>
      <video:thumbnail_loc>${thumbUrl}</video:thumbnail_loc>
      <video:title>${project.title} - Video Overview</video:title>
      <video:description>${project.excerpt || project.title}</video:description>
      <video:content_loc>${videoUrl}</video:content_loc>
    </video:video>
`;
    }*/

    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  // 6. Return the raw XML
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      // Cache control ensures browsers and bots cache the file properly
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate',
    },
  });
}