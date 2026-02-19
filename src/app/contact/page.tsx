'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    
    // The formspree ID I have made
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjgeoogv";

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset(); // Clear form
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  }

  return (
    <section className="min-h-screen pt-32 px-6 flex flex-col items-center">
      
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-zinc-400">
                Have a project in mind or just want to say hi? I'm always open to discussing new opportunities.
            </p>
        </div>

        {/* The Glass Form */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
            {status === 'success' ? (
                <div className="text-center py-12">
                    <div className="text-emerald-400 text-5xl mb-4">✓</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-zinc-400">I'll get back to you as soon as possible.</p>
                    <button 
                        onClick={() => setStatus('idle')} 
                        className="mt-6 px-6 py-2 bg-zinc-800 rounded-lg text-sm hover:bg-zinc-700"
                    >
                        Send another
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name" 
                            required 
                            className="w-full bg-zinc-950/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                            placeholder="John Doe"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            required 
                            className="w-full bg-zinc-950/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                            placeholder="john@example.com"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">Message</label>
                        <textarea 
                            name="message" 
                            id="message" 
                            rows={4} 
                            required 
                            className="w-full bg-zinc-950/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors resize-none"
                            placeholder="Tell me about your project..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={status === 'submitting'}
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    </button>

                    {status === 'error' && (
                        <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
                    )}
                </form>
            )}
        </div>
      </div>
    </section>
  );
}