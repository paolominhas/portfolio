import './globals.css';
import Navbar from '@/components/navbar';
import Scene from '@/components/scene'; // The 3D background we built earlier

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