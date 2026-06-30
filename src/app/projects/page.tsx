import Link from 'next/link';
import { getMarkdownFiles } from '@/lib/markdown';
import { Activity, Heart, Home } from 'lucide-react';
import Image from 'next/image';
import FeedbackForm from '@/components/FeedbackForm';
import TransitionLink from '@/components/TransitionLink';

export default function ProjectsPage() {
  const projects = getMarkdownFiles('projects').sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24">
      <Link href="/" className="fixed top-6 right-6 md:top-8 md:right-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:scale-105 hover:bg-slate-50 dark:hover:bg-slate-700 p-3 md:p-4 rounded-full shadow-sm hover:shadow-md transition-all z-50 flex items-center justify-center" title="Back to Home">
        <Home size={22} className="text-black dark:text-white" />
      </Link>
      <div className="w-full max-w-6xl flex flex-col items-start">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
          Case Studies
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg mb-12">
          A selection of recent projects, product teardowns, and design experiments.
          Exploring the intersection of tactile UI and functional problem solving.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {projects.map((p: any) => {
            const isFeatured = p.isFeatured;
            return (
              <div key={p.slug} className={`bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col ${isFeatured ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'}`}>
                <div className="w-full h-[280px] sm:h-[320px] bg-slate-100 dark:bg-slate-800 relative">
                  {(p.coverImage || p.thumbnail) && (
                    <Image src={p.coverImage || p.thumbnail} alt={p.title} fill className="object-cover" />
                  )}
                </div>
                
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">
                    {p.tagIcon === 'BarChart' && <Activity size={14} />}
                    {p.tagIcon === 'Heart' && <Heart size={14} />}
                    {p.tag}
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                    {p.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-6 flex-grow">
                    {p.summary}
                  </p>
                  
                  <TransitionLink href={`/projects/${p.slug}`} className={`
                    ${p.buttonStyle === 'primary' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-transparent' 
                      : 'bg-transparent hover:bg-slate-50 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                    } border rounded-full px-6 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 w-max
                    ${!isFeatured ? '!w-full' : ''}
                  `}>
                    {p.buttonText}
                  </TransitionLink>

                  <FeedbackForm entityId={p.slug} isFeatured={isFeatured} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
