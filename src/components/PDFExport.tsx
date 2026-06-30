"use client";

import { Printer } from 'lucide-react';

export function PDFExport({ targetElementId, filename }: { targetElementId: string, filename: string }) {
  async function handleExport() {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById(targetElementId);
    
    if (!element) {
      alert("Target element not found.");
      return;
    }

    const opt = {
      margin:       0.5,
      filename:     `${filename}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  }

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 font-bold text-sm transition-colors"
    >
      <Printer size={16} /> Export PDF
    </button>
  );
}
