export default function Footer() {
  return (
    <footer className="w-full bg-transparent backdrop-blur-md py-8 px-8 mt-auto border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-xl font-bold text-slate-800 dark:text-white">
          Portfolio
        </div>
        
        <nav className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Email</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">GitHub</a>
        </nav>
        
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Akshat Gupta
        </div>
      </div>
    </footer>
  );
}
