import Link from 'next/link';
import Image from 'next/image';
import { Home, MapPin, Coffee, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export default async function AboutPage() {
  const filePath = path.join(process.cwd(), 'content', 'about.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24">
      <Link href="/" className="fixed top-6 right-6 md:top-8 md:right-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:scale-105 hover:bg-slate-50 dark:hover:bg-slate-700 p-3 md:p-4 rounded-full shadow-sm hover:shadow-md transition-all z-50 flex items-center justify-center" title="Back to Home">
        <Home size={22} className="text-black dark:text-white" />
      </Link>

      <div className="w-full max-w-5xl flex flex-col gap-12 mt-4 md:mt-8">
        
        {/* Top Profile Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 w-full">
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shrink-0 border-4 border-white dark:border-slate-800 shadow-md">
            <Image 
              src={data.profileImage} 
              alt={`${data.name} Profile`} 
              fill 
              className="object-cover"
            />
          </div>
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-grow">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
              Hi, I&apos;m {data.name}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-6">
              {data.bio}
            </p>
            
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-100 dark:border-emerald-900/50">
                <MapPin size={16} />
                {data.location}
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-100 dark:border-emerald-900/50">
                <Coffee size={16} />
                {data.hobby}
              </div>
            </div>
          </div>
        </div>

        {/* Lower Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          
          {/* Left Column - Experience */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-400">
                <Briefcase size={22} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Experience</h2>
            </div>
            
            <div className="relative pl-8 md:pl-10 flex flex-col gap-10 before:content-[''] before:absolute before:left-[11px] md:before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
              
              {data.experience.map((exp: any, i: number) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[32px] md:-left-[40px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-white dark:ring-slate-900 z-10 ${i === 0 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{exp.role}</h3>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold px-3 py-1.5 rounded-full self-start sm:self-auto shrink-0 tracking-wider uppercase">
                      {exp.dates}
                    </span>
                  </div>
                  <div className={`${i === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'} font-semibold text-sm mb-3`}>
                    {exp.company}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}

            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 lg:col-span-1 h-full">
            
            {/* Education Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col flex-1 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-400">
                  <GraduationCap size={22} />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Education</h2>
              </div>
              
              <div className="flex flex-col gap-6">
                {data.education.map((edu: any, i: number) => (
                  <div key={i}>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{edu.degree}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">{edu.school}</p>
                    <p className="text-[11px] font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wide">{edu.dates}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col flex-1 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-400">
                  <Sparkles size={22} />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Skills</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string) => (
                  <span key={skill} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
