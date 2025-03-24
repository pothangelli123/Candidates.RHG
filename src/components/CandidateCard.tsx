import { Candidate } from '@/types';
import Link from 'next/link';

type CandidateCardProps = {
  candidate: Candidate;
};

export default function CandidateCard({ candidate }: CandidateCardProps) {
  // Function to get badge color based on status
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
    <div className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-foreground/90">{candidate.name}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
          </span>
        </div>
        
        <p className="text-foreground/70 text-sm">{candidate.position}</p>
        
        <div className="mt-3 space-y-1 text-sm text-foreground/70">
          <p>📧 {candidate.email}</p>
          {candidate.phone && <p>📱 {candidate.phone}</p>}
          <p>🎓 {candidate.education}</p>
          <p>⏱️ {candidate.experience} years of experience</p>
        </div>
        
        <div className="mt-4">
          <h4 className="text-xs font-medium uppercase text-foreground/50 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {candidate.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-2 py-1 rounded-md text-xs bg-foreground/10 text-foreground/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-5 pt-4 border-t flex justify-end">
          <Link 
            href={`/candidates/${candidate.id}`}
            className="text-sm font-medium text-foreground rounded-full px-4 py-1.5 bg-foreground/5 hover:bg-foreground/10 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 