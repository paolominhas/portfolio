export interface Article {
  id: string;
  title: string;
  slug: string; // This is the URL part (e.g. "my-cool-app")
  description: string;
  techStack: string[];
  content: string; // You can use HTML or Markdown here
  image: string; // Path to image in /public folder
}

export const articles: Article[] = [
  {
    id: '1',
    title: 'Article yes',
    slug: 'article-one',
    description: 'A high-performance financial analytics tool built with D3.js.',
    techStack: ['Next.js', 'TypeScript', 'D3.js', 'Tailwind'],
    image: '/images/dashboard.jpg', // You need to put this image in public/images/
    content: `
      <p>This project solved a major problem in visualization...</p>
      <h2>The Challenge</h2>
      <p>Rendering 10,000 data points in real-time...</p>
    `,
  },
  {
    id: '2',
    title: 'Article please',
    slug: 'article-two',
    description: 'An interface for Stable Diffusion using serverless functions.',
    techStack: ['React', 'Python', 'FastAPI'],
    image: '/images/ai-gen.jpg',
    content: `
      <p>Integrated custom fine-tuned models for specific architectural styles...</p>
    `,
  },
];