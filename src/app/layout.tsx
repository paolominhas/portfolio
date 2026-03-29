import './globals.css';
import Navbar from '@/components/navbar';
import Scene from '@/components/scene'; // The 3D background we built earlier
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: {
    template: '%s | Paolo Minhas',
    default: 'Paolo Minhas | My Website', 
  },
  description: 'Learn about the world, physics and music.',
  metadataBase: new URL('https://paolo.org.uk'), // Crucial for absolute URLs
  openGraph: {
    title: 'My Portfolio',
    description: 'Learn about the world, physics and music.',
    url: 'https://paolo.org.uk',
    siteName: 'Paolo Minhas',
    images: [
      {
        url: '/og-image.jpg', // Create a 1200x630 image in your public folder
        width: 1200,
        height: 630,
        alt: 'Beautiful Edinburgh where I live.',
      },
    ],
    locale: 'en_UK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Portfolio',
    description: 'Learn about the world, physics and music.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* Add the bg-zinc-950 class here directly */}
      <body className="bg-zinc-950 text-zinc-100 antialiased overflow-x-hidden">
        <Scene />
        <Navbar />
        <main className="relative z-10">
            {children}
        </main>
      </body>
    </html>
  );
}