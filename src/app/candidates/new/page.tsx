import Link from 'next/link';
import NewCandidateForm from './NewCandidateForm';

export default function NewCandidatePage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/candidates"
            className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground"
          >
            <svg 
              className="h-4 w-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            Back to Candidates
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-foreground mt-4">Add New Candidate</h1>
      </div>
      
      <div className="bg-white dark:bg-black rounded-lg border border-foreground/10 shadow-sm overflow-hidden p-6 sm:p-8">
        <NewCandidateForm />
      </div>
    </div>
  );
} 