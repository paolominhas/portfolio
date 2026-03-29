export interface Project {
  id: string;
  title: string;
  slug: string; // This is the URL part (e.g. "my-cool-app")
  description: string;
  techStack: string[];
  content: string; // You can use HTML or Markdown here
  image: string; // Path to image in /public folder
  excerpt: string;
}

export const projects: Project[] = [
  {
    id: 'hibeam', // Unique ID
    title: 'MPhys Thesis',
    slug: 'hibeam', // CRITICAL: This MUST match your folder name exactly!
    description: 'Simulations of the prototype Time Projection Chamber for \'HIBEAM\' at ESS (Lund, SE) in geant4, and comarison to data from Krakow IFJ',
    techStack: ['geant4', 'ROOT (C++)', 'python', 'linux', 'vim'],
    image: '/images/root-project-thumbnail.jpg', // Add a nice thumbnail to public/images/
    excerpt: 'Simulations of the prototype Time Projection Chamber for \'HIBEAM\' at ESS (Lund, SE) in geant4, and comarison to data from Krakow IFJ',
    
    // You can leave content blank or put a short summary, 
    // because your custom page doesn't actually render this field.
    content: '', 
  },
  
  {
    id: '1',
    title: 'Charmed Lambda Baryon Decays',
    slug: 'ppss',
    description: 'From the PPSS IFJ-PAN internship 2026 in Krakow, working with Prof. Dr. hab. Mariusz Witek on the LHCb collaboration.',
    techStack: ['ROOT', 'python', 'XGBoost', 'Boosted Decision Tree'],
    image: '/images/LHCb.png', // You need to put this image in public/images/
    content: `
      <p>This project solved a major problem in visualization...</p>
      <h2>The Challenge</h2>
      <p>Rendering 10,000 data points in real-time...</p>
    `,
    excerpt: '',
  },
  {
    id: '2',
    title: 'Simulating Neutrino Oscillation Detectors at DUNE',
    slug: 'globes',
    description: 'An interface for Stable Diffusion using serverless functions.',
    techStack: ['React', 'Python', 'FastAPI'],
    image: '/images/ai-gen.jpg',
    content: `
      <p>Integrated custom fine-tuned models for specific architectural styles...</p>
    `,
    excerpt: '',
  },

  {
    id: '3', // Unique ID
    title: 'Study of the Near Detector at DUNE',
    slug: 'dune-nd', // CRITICAL: This MUST match your folder name exactly!
    description: 'Bachelor dissertation: ',
    techStack: ['Next.js', 'Three.js', 'React Three Fiber', 'C++ ROOT'],
    image: '/images/root-project-thumbnail.jpg', // Add a nice thumbnail to public/images/
    
    // You can leave content blank or put a short summary, 
    // because your custom page doesn't actually render this field.
    content: '', 
    excerpt: '',
  }
];