import { Candidate } from '@/types';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import PDF viewer to avoid SSR issues
const PDFPreview = dynamic(() => import('./PDFPreview'), { 
  ssr: false,
  loading: () => <div className="p-10 text-center">Loading PDF viewer...</div>
});

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
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  
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

  // Handle schedule interview
  const handleScheduleInterview = () => {
    // In a real app, this would call an API to schedule the interview
    // For now, we'll just simulate success
    setTimeout(() => {
      setScheduleSuccess(true);
      setTimeout(() => {
        setShowScheduleModal(false);
        setScheduleSuccess(false);
      }, 2000);
    }, 1000);
  };
  
  return (
    <div className="bg-white rounded-lg border border-foreground/10 shadow-sm overflow-hidden">
      <div className="px-6 py-5 sm:px-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">{candidate.name}</h1>
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(candidate.status)}`}>
              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
            </span>
            
            <button
              onClick={() => setShowConfirmDelete(true)}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm text-foreground/60">Position</h3>
                <p className="text-foreground">{candidate.position}</p>
              </div>
              <div>
                <h3 className="text-sm text-foreground/60">Email</h3>
                <p className="text-foreground">{candidate.email}</p>
              </div>
              {candidate.phone && (
                <div>
                  <h3 className="text-sm text-foreground/60">Phone</h3>
                  <p className="text-foreground">{candidate.phone}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm text-foreground/60">Years of Experience</h3>
                <p className="text-foreground">{candidate.experience}</p>
              </div>
              <div>
                <h3 className="text-sm text-foreground/60">Applied On</h3>
                <p className="text-foreground">{formatDate(candidate.createdAt)}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Qualifications</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm text-foreground/60">Education</h3>
                <p className="text-foreground whitespace-pre-line">{candidate.education}</p>
              </div>
              <div>
                <h3 className="text-sm text-foreground/60">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {candidate.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-foreground/5 rounded-md text-foreground/80">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {candidate.notes && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-2">Notes</h2>
            <p className="text-foreground/80 whitespace-pre-line">{candidate.notes}</p>
          </div>
        )}
        
        {/* Resume section with preview/download */}
        {candidate.resume && (
          <div className="mb-8 border-t border-foreground/10 pt-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Resume</h2>
            <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <svg 
                    className="h-8 w-8 text-foreground/70" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                    />
                  </svg>
                  <div>
                    <p className="text-foreground font-medium">Candidate Resume</p>
                    <p className="text-xs text-foreground/60">PDF Document</p>
                  </div>
                </div>
                
                <a 
                  href={candidate.resume} 
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
                  Download Resume
                </a>
              </div>
              
              <div className="mt-4">
                <PDFPreview fileUrl={candidate.resume} />
              </div>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="mt-8 border-t border-foreground/10 pt-6 flex justify-end gap-4">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            <svg 
              className="h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            Schedule Interview
          </button>
        </div>
      </div>

      {/* Confirm delete modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Confirm Deletion</h3>
            <p className="text-foreground/70 mb-4">
              Are you sure you want to delete this candidate? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  onDelete();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Schedule interview modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Schedule Interview</h3>
            
            {scheduleSuccess ? (
              <div className="text-center py-8">
                <svg 
                  className="h-16 w-16 text-green-500 mx-auto mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <p className="text-foreground font-medium mb-1">Interview Scheduled!</p>
                <p className="text-foreground/70 text-sm">
                  The candidate will be notified about the interview details.
                </p>
              </div>
            ) : (
              <>
                <p className="text-foreground/70 mb-6">
                  Schedule an interview with {candidate.name} for the {candidate.position} position.
                </p>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1">
                      Date
                    </label>
                    <input 
                      type="date" 
                      className="block w-full rounded-md border border-foreground/20 py-2 px-3 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1">
                      Time
                    </label>
                    <input 
                      type="time" 
                      className="block w-full rounded-md border border-foreground/20 py-2 px-3 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1">
                      Interview Method
                    </label>
                    <select
                      className="block w-full rounded-md border border-foreground/20 py-2 px-3 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option>Video Call</option>
                      <option>Phone Call</option>
                      <option>In-person</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleScheduleInterview}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
                  >
                    Schedule
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 