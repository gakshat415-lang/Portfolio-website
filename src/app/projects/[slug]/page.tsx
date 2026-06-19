import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMarkdownContent } from '@/lib/markdown';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getMarkdownContent('projects', slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24">
      <article className="w-full max-w-3xl flex flex-col items-start bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8 md:p-16 rounded-3xl mt-8">
        <Link href="/projects" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors mb-8 flex items-center gap-2">
          &larr; Back to Projects
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
          {project.title}
        </h1>
        {project.published_at && (
          <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium text-sm">
            {new Date(project.published_at).toLocaleDateString()}
          </p>
        )}
        <div 
          className="w-full text-slate-700 dark:text-slate-300 text-lg leading-relaxed 
                     [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:dark:text-white [&>h2]:mt-12 [&>h2]:mb-4
                     [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:dark:text-white [&>h3]:mt-8 [&>h3]:mb-3
                     [&>p]:mt-4 [&>p]:mb-6
                     [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mt-4 [&>ul]:mb-6
                     [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mt-4 [&>ol]:mb-6
                     [&>a]:text-blue-600 [&>a]:dark:text-blue-400 [&>a]:hover:underline
                     [&>img]:w-full [&>img]:h-auto [&>img]:rounded-2xl [&>img]:my-10 [&>img]:shadow-md [&>img]:border [&>img]:border-slate-200 [&>img]:dark:border-slate-800 [&>img]:object-cover"
          dangerouslySetInnerHTML={{ __html: project.contentHtml }}
        />
      </article>
    </main>
  );
}
