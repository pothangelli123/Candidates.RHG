import { Candidate } from '@/types';
import { useState } from 'react';
import Link from 'next/link';

type CandidateDetailProps = {
  candidate: Candidate;
  onDelete: () => void;
  isDeleting: boolean;
};

export default function CandidateDetail({ 
  candidate, 
  onDelete,
  isDeleting
}: CandidateDetailProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Function to get status badge color
  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'interviewed':
        return 'bg-purple-100 text-purple-800';
      case 'offer':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white dark:bg-black rounded-lg border border-foreground/10 shadow-sm overflow-hidden">
      <div className="px-6 py-5 sm:px-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">{candidate.name}</h1>
          
          <div className="flex items-center gap-3">
            <Link
              href={`/candidates/${candidate.id}/edit`}
              className="inline-flex items-center rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-foreground/5"
            >
              Edit
            </Link>
            
            {!showConfirmDelete ? (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="inline-flex items-center rounded-md border border-red-300 bg-red-50 dark:bg-red-900/20 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                Delete
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center rounded-md border border-red-300 bg-red-50 dark:bg-red-900/30 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/40"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm'}
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="inline-flex items-center rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-foreground/5"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="block text-sm font-medium text-foreground/60">Position</span>
                  <span className="block text-foreground mt-1">{candidate.position}</span>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-foreground/60">Status</span>
                  <span className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                  </span>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-foreground/60">Email</span>
                  <a href={`mailto:${candidate.email}`} className="block text-foreground hover:underline mt-1">{candidate.email}</a>
                </div>
                
                {candidate.phone && (
                  <div>
                    <span className="block text-sm font-medium text-foreground/60">Phone</span>
                    <a href={`tel:${candidate.phone}`} className="block text-foreground hover:underline mt-1">{candidate.phone}</a>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1.5 rounded-md text-sm bg-foreground/10 text-foreground/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">Experience & Education</h2>
              <div className="space-y-3">
                <div>
                  <span className="block text-sm font-medium text-foreground/60">Years of Experience</span>
                  <span className="block text-foreground mt-1">{candidate.experience} years</span>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-foreground/60">Education</span>
                  <span className="block text-foreground mt-1">{candidate.education}</span>
                </div>
                
                {candidate.resume && (
                  <div>
                    <span className="block text-sm font-medium text-foreground/60">Resume</span>
                    <a 
                      href={candidate.resume} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center mt-1 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Resume
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {candidate.notes && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Notes</h2>
                <div className="p-4 rounded-lg bg-foreground/5 text-foreground/90">
                  {candidate.notes}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-foreground/10">
          <div className="flex justify-between text-sm text-foreground/60">
            <span>Created: {formatDate(candidate.createdAt)}</span>
            <span>Last updated: {formatDate(candidate.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 