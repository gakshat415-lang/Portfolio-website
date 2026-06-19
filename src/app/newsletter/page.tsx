import Link from 'next/link';
import { getMarkdownFiles } from '@/lib/markdown';
import { Home, Mail, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import SubscribeForm from '@/components/SubscribeForm';
import TransitionLink from '@/components/TransitionLink';

export default function NewsletterPage() {
  const issues = getMarkdownFiles('newsletters').sort((a: any, b: any) => (b.issueNumber || 0) - (a.issueNumber || 0));

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24">
      <Link href="/" className="fixed top-6 right-6 md:top-8 md:right-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:scale-105 hover:bg-slate-50 dark:hover:bg-slate-700 p-3 md:p-4 rounded-full shadow-sm hover:shadow-md transition-all z-50 flex items-center justify-center" title="Back to Home">
        <Home size={22} className="text-black dark:text-white" />
      </Link>
      
      <div className="w-full max-w-6xl flex flex-col items-start">
        
        {/* Hero Section */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
          The Joyful Dispatch
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg mb-8">
          Occasional musings on design, creative coding, and the messy process of making things. No spam, just good vibes.
        </p>
        
        <SubscribeForm />

        {/* Recent Issues */}
        <div className="w-full flex items-center gap-3 mb-8 px-2">
          <div className="bg-[#4a5f6e] p-2.5 rounded-full text-white shadow-sm">
            <Mail size={20} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Recent Issues
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {issues.map((issue: any) => (
            <TransitionLink key={issue.slug} href={`/newsletter/${issue.slug}`} className="group bg-white dark:bg-slate-900 rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-full h-56 bg-slate-100 dark:bg-slate-800 relative">
                {issue.coverImage && (
                  <Image src={issue.coverImage} alt={issue.title} fill className="object-cover" />
                )}
                {issue.issueNumber && (
                  <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-3.5 py-1 rounded-full text-[11px] font-bold text-purple-600 dark:text-purple-400 shadow-sm">
                    Issue #{issue.issueNumber}
                  </div>
                )}
              </div>
              
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug tracking-tight">
                  {issue.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow">
                  {issue.summary}
                </p>
                
                <div className="mt-8 pt-4 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-purple-600 dark:text-purple-400 font-bold group-hover:underline">Read issue &rarr;</span>
                  <div className="flex items-center gap-4">
                    <span>{issue.published_at}</span>
                    <div className="flex items-center gap-1.5 text-orange-500 dark:text-orange-400/90">
                      <MessageSquare size={14} className="scale-x-[-1]" />
                      <span>{issue.commentsCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TransitionLink>
          ))}
        </div>

      </div>
    </main>
  );
}
