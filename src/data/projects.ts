export interface Project {
  id: string;
  title: string;
  slug: string; // This is the URL part (e.g. "my-cool-app")
  description: string;
  techStack: string[];
  content: string; // You can use HTML or Markdown here
  image: string; // Path to image in /public folder
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Neon Financial Dashboard',
    slug: 'neon-dashboard',
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
    title: 'AI Image Generator',
    slug: 'ai-generator',
    description: 'An interface for Stable Diffusion using serverless functions.',
    techStack: ['React', 'Python', 'FastAPI'],
    image: '/images/ai-gen.jpg',
    content: `
      <p>Integrated custom fine-tuned models for specific architectural styles...</p>
    `,
  },

  {
    id: 'hibeam', // Unique ID
    title: 'Detector Geometry Simulation',
    slug: 'hibeam', // CRITICAL: This MUST match your folder name exactly!
    description: 'An interactive 3D simulation of CERN ROOT geometry using React Three Fiber and converted glTF models.',
    techStack: ['Next.js', 'Three.js', 'React Three Fiber', 'C++ ROOT'],
    image: '/images/root-project-thumbnail.jpg', // Add a nice thumbnail to public/images/
    
    // You can leave content blank or put a short summary, 
    // because your custom page doesn't actually render this field.
    content: '', 
  }
];