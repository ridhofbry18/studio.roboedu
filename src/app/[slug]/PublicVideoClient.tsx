"use client";

import { DownloadSimple, PlayCircle, Clock, ShieldCheck, ShareNetwork } from "@phosphor-icons/react";
import { useState } from "react";
import Image from "next/image";

function extractDriveId(url: string) {
  const match = url.match(/\/d\/(.+?)\//);
  if (match && match[1]) return match[1];
  const paramMatch = url.match(/id=(.+?)(&|$)/);
  if (paramMatch && paramMatch[1]) return paramMatch[1];
  return null;
}

export function PublicVideoClient({ 
  slug, 
  driveLink, 
  targetName, 
  targetDesc, 
  teamName, 
  submittedAt 
}: { 
  slug: string, 
  driveLink: string, 
  targetName: string, 
  targetDesc: string, 
  teamName: string, 
  submittedAt: string 
}) {
  const [copied, setCopied] = useState(false);
  const driveId = extractDriveId(driveLink);

  const embedUrl = driveId ? `https://drive.google.com/file/d/${driveId}/preview` : driveLink;
  const downloadUrl = driveId ? `https://drive.google.com/uc?export=download&id=${driveId}` : driveLink;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Navbar Public */}
      <header className="h-[70px] border-b border-border/50 bg-surface/50 backdrop-blur-lg sticky top-0 z-50 flex items-center px-4 md:px-8">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-border p-1 flex items-center justify-center">
              <img src="/logo.png" alt="RoboEdu Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-heading font-black text-lg leading-none text-sky-500">RoboEdu Studio</h1>
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Video Delivery System</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <ShieldCheck size={16} weight="fill" />
            Verified Content
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-4 md:px-8 py-8 animate-fade-in-up">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Video Section */}
          <div className="flex-1 space-y-6">
            <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group">
              {driveId ? (
                <iframe 
                  src={embedUrl} 
                  className="w-full h-full border-0" 
                  allow="autoplay; fullscreen"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
                  <PlayCircle size={64} weight="duotone" className="mb-4 opacity-50" />
                  <p>Video tidak dapat di-embed secara langsung.</p>
                  <a href={driveLink} target="_blank" rel="noopener noreferrer" className="mt-4 px-6 py-2 bg-sky-500 text-white rounded-full text-sm font-bold hover:bg-sky-600 transition-colors">Buka di Tab Baru</a>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-500 text-[10px] font-black uppercase tracking-wider border border-sky-500/20">
                      {targetDesc}
                    </span>
                    <span className="text-xs text-foreground/50 font-medium flex items-center gap-1">
                      <Clock size={14} /> Dipublikasikan {new Date(submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black mb-2">{targetName}</h2>
                  <p className="text-foreground/60 font-medium">Dipersembahkan oleh <strong className="text-foreground">{teamName}</strong></p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface-variant hover:bg-surface border border-border text-sm font-bold transition-all shadow-sm hover:shadow-md"
                  >
                    <ShareNetwork size={20} weight="duotone" className={copied ? "text-emerald-500" : "text-sky-500"} />
                    {copied ? "Tersalin!" : "Bagikan"}
                  </button>
                  <a 
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:opacity-90 text-white text-sm font-bold transition-all shadow-lg shadow-sky-500/25 transform hover:-translate-y-0.5"
                  >
                    <DownloadSimple size={20} weight="bold" />
                    Unduh Resolusi Asli
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-8 text-center text-xs font-bold text-foreground/40 mt-12 border-t border-border/50">
        &copy; {new Date().getFullYear()} RoboEdu Studio. All rights reserved.
      </footer>
    </div>
  );
}
