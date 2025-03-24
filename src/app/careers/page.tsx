import Link from 'next/link';

export default function CareersPage() {
  // Replace this URL with your company's actual job listings URL
  const externalJobsUrl = 'https://yourcompany.com/careers';
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Join Our Team</h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          We're looking for talented individuals to help us build the future. Check out our open positions and find your next opportunity.
        </p>
      </div>
      
      <div className="bg-white dark:bg-black rounded-lg border border-foreground/10 shadow-sm overflow-hidden p-8 text-center">
        <svg 
          className="h-16 w-16 mx-auto text-foreground/60" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
          />
        </svg>
        
        <h2 className="text-2xl font-semibold text-foreground mt-6 mb-4">View All Open Positions</h2>
        <p className="text-foreground/70 mb-8">
          Visit our company careers page to see our current job openings and apply online.
        </p>
        
        <a 
          href={externalJobsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-foreground px-6 py-3 text-base font-medium text-background shadow-sm hover:opacity-90 transition-opacity"
        >
          Browse Job Openings
          <svg 
            className="ml-2 -mr-1 h-4 w-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
            />
          </svg>
        </a>
      </div>
      
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold text-foreground mb-4">Don't see the right role?</h3>
        <p className="text-foreground/70 mb-6">
          We're always looking for talented people to join our team. Send us your resume and we'll keep you in mind for future openings.
        </p>
        <a 
          href="mailto:careers@yourcompany.com"
          className="text-foreground/80 hover:text-foreground hover:underline font-medium"
        >
          careers@yourcompany.com
        </a>
      </div>
    </div>
  );
} 