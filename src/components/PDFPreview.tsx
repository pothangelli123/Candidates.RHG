'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Use a simpler approach for PDF preview
type PDFPreviewProps = {
  fileUrl: string;
};

export default function PDFPreview({ fileUrl }: PDFPreviewProps) {
  return (
    <div className="pdf-preview">
      <div className="p-4 bg-white border border-foreground/20 rounded-md">
        <p className="text-center text-foreground/70 py-8">
          PDF preview would be displayed here in a production application.
          <br />
          For security and privacy, actual PDF viewing requires additional setup.
        </p>
        <div className="text-center mt-2">
          <a 
            href={fileUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <svg 
              className="h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
              />
            </svg>
            Open PDF
          </a>
        </div>
      </div>
    </div>
  );
} 