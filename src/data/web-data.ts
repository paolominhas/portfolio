export interface Tutorial {
  slug: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  content: string;
}

export const tutorials: Tutorial[] = [
  {
    slug: "getting-started-with-node",
    title: "Getting Started with Node.js",
    description:
      "Install Node, understand npm, and write your first server in 15 minutes.",
    difficulty: "beginner",
    tags: ["Node.js", "npm", "Backend"],
    content: "",
  },
  {
    slug: "nextjs-from-scratch",
    title: "Next.js from Scratch",
    description:
      "Build a full Next.js app with App Router, layouts, and deployment.",
    difficulty: "beginner",
    tags: ["Next.js", "React", "Vercel"],
    content: "",
  },
  {
    slug: "docker-for-web-devs",
    title: "Docker for Web Developers",
    description:
      "Containerise your Node app, set up nginx, and deploy to a VPS.",
    difficulty: "intermediate",
    tags: ["Docker", "nginx", "DevOps"],
    content: "",
  },
];

export interface WebProject {
  slug: string;
  title: string;
  description: string;
  url: string;
  image: string;
  tags: string[];
  content: string;
}

export const webProjects: WebProject[] = [
  {
    slug: "euco",
    title: "Edinburgh University Chamber Orchestra",
    description:
      "Full website rebuild from CRA to Next.js 15, with ISR data fetching, Docker deployment, and a custom concert page.",
    url: "https://www.eu-co.co.uk",
    image: "/images/web/euco.jpg",
    tags: ["Next.js", "Docker", "nginx", "Let's Encrypt"],
    content: "",
  },
];
